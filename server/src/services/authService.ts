import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';
import type { RegisterInput, LoginInput, UpdateProfileInput } from '../validators/authValidators.js';

const SALT_ROUNDS = 10;

function sanitizeUser(user: InstanceType<typeof User>) {
  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}

export async function register(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new AppError(409, 'Este email ya está registrado', 'EMAIL_EXISTS');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await User.create({
    email: input.email,
    passwordHash,
    username: input.username,
  });

  const token = signToken({ userId: user._id.toString(), email: user.email });

  return { user: sanitizeUser(user), token };
}

export async function login(input: LoginInput) {
  const user = await User.findOne({ email: input.email }).select('+passwordHash');
  if (!user) {
    throw new AppError(401, 'Email o contraseña incorrectos', 'INVALID_CREDENTIALS');
  }

  if (!user.passwordHash) {
    throw new AppError(401, 'Esta cuenta usa inicio de sesión con Google', 'USE_GOOGLE');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, 'Email o contraseña incorrectos', 'INVALID_CREDENTIALS');
  }

  const token = signToken({ userId: user._id.toString(), email: user.email });

  return { user: sanitizeUser(user), token };
}

export async function googleLogin(credential: string) {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new AppError(503, 'Inicio de sesión con Google no configurado', 'GOOGLE_NOT_CONFIGURED');
  }

  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw new AppError(401, 'Token de Google no válido', 'INVALID_GOOGLE_TOKEN');
  }

  if (!payload?.email || !payload.sub) {
    throw new AppError(401, 'Token de Google no válido', 'INVALID_GOOGLE_TOKEN');
  }

  let user = await User.findOne({
    $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }],
  }).select('+passwordHash');

  if (user) {
    if (!user.googleId) {
      user.googleId = payload.sub;
    }
    if (payload.picture && !user.avatar) {
      user.avatar = payload.picture;
    }
    await user.save();
  } else {
    const baseUsername = (payload.name ?? payload.email.split('@')[0])
      .replace(/\s+/g, '')
      .slice(0, 20);
    let username = baseUsername;
    let suffix = 1;
    while (await User.findOne({ username })) {
      username = `${baseUsername}${suffix++}`;
    }

    user = await User.create({
      email: payload.email.toLowerCase(),
      googleId: payload.sub,
      username,
      avatar: payload.picture,
    });
  }

  const token = signToken({ userId: user._id.toString(), email: user.email });
  return { user: sanitizeUser(user), token };
}

export async function getMe(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  }
  return sanitizeUser(user);
}

const ALLOWED_AVATAR_DATA_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function normalizeAvatar(value: string | null | undefined): string | undefined | null {
  if (value === undefined) return undefined;
  if (value === null || value.trim() === '') return null;

  const avatar = value.trim();

  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    if (avatar.length > 2048) {
      throw new AppError(400, 'La URL de la imagen es demasiado larga', 'INVALID_AVATAR');
    }
    return avatar;
  }

  const dataMatch = /^data:(image\/(?:jpeg|png|webp|gif));base64,([a-zA-Z0-9+/=]+)$/.exec(avatar);
  if (!dataMatch) {
    throw new AppError(400, 'Formato de imagen no válido', 'INVALID_AVATAR');
  }

  const mime = dataMatch[1];
  if (!ALLOWED_AVATAR_DATA_TYPES.includes(mime)) {
    throw new AppError(400, 'Formato de imagen no válido. Usa JPG, PNG, WEBP o GIF', 'INVALID_AVATAR');
  }

  if (avatar.length > 400_000) {
    throw new AppError(400, 'La imagen es demasiado grande (máx. ~300 KB)', 'AVATAR_TOO_LARGE');
  }

  return avatar;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) {
    throw new AppError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
  }

  if (input.username !== undefined && input.username !== user.username) {
    const taken = await User.findOne({ username: input.username, _id: { $ne: userId } });
    if (taken) {
      throw new AppError(409, 'Este nombre de usuario ya está en uso', 'USERNAME_EXISTS');
    }
    user.username = input.username.trim();
  }

  if (input.avatar !== undefined) {
    user.avatar = normalizeAvatar(input.avatar) ?? undefined;
  }

  await user.save();
  return sanitizeUser(user);
}
