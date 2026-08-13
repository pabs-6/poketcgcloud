import { ZodError, type ZodIssue } from 'zod';

const FIELD_LABELS: Record<string, string> = {
  email: 'email',
  password: 'contraseña',
  username: 'usuario',
  credential: 'credencial de Google',
  cardId: 'carta',
  quantity: 'cantidad',
  condition: 'condición',
};

function fieldLabel(path: (string | number)[]): string {
  const key = String(path[0] ?? 'campo');
  return FIELD_LABELS[key] ?? key;
}

function issueMessage(issue: ZodIssue): string {
  const field = fieldLabel(issue.path);

  switch (issue.code) {
    case 'invalid_type':
      if (issue.received === 'undefined') return `El campo ${field} es obligatorio`;
      return `El campo ${field} no es válido`;
    case 'invalid_string':
      if (issue.validation === 'email') return 'Introduce un email válido';
      return `El campo ${field} no es válido`;
    case 'too_small':
      if (issue.type === 'string' && issue.minimum === 1) return `El campo ${field} es obligatorio`;
      if (issue.type === 'string') return `El ${field} debe tener al menos ${issue.minimum} caracteres`;
      if (issue.type === 'number') return `El valor de ${field} es demasiado bajo`;
      return `El campo ${field} es demasiado corto`;
    case 'too_big':
      return `El campo ${field} es demasiado largo`;
    default:
      return 'Datos no válidos. Revisa el formulario.';
  }
}

export function formatZodError(err: ZodError): string {
  const first = err.issues[0];
  return first ? issueMessage(first) : 'Datos no válidos. Revisa el formulario.';
}

/** Mensajes en español por código de error interno */
export const ERROR_MESSAGES_ES: Record<string, string> = {
  EMAIL_EXISTS: 'Este email ya está registrado',
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
  USE_GOOGLE: 'Esta cuenta usa inicio de sesión con Google',
  GOOGLE_NOT_CONFIGURED: 'Inicio de sesión con Google no configurado en el servidor',
  INVALID_GOOGLE_TOKEN: 'Token de Google no válido. Vuelve a intentarlo',
  USER_NOT_FOUND: 'Usuario no encontrado',
  USERNAME_EXISTS: 'Este nombre de usuario ya está en uso',
  INVALID_AVATAR: 'Formato de imagen no válido',
  AVATAR_TOO_LARGE: 'La imagen es demasiado grande (máx. ~300 KB)',
  UNAUTHORIZED: 'Debes iniciar sesión para continuar',
  INVALID_TOKEN: 'Sesión expirada o no válida. Vuelve a iniciar sesión',
  CARD_NOT_FOUND: 'Carta no encontrada en la API de Pokémon TCG',
  NOT_FOUND: 'Recurso no encontrado',
  RATE_LIMIT: 'Demasiados intentos. Espera un momento e inténtalo de nuevo',
  VALIDATION_ERROR: 'Datos no válidos. Revisa el formulario',
  MONGOOSE_VALIDATION_ERROR: 'Datos no válidos. Revisa el formulario',
  INTERNAL_ERROR: 'Error interno del servidor. Inténtalo más tarde',
  POKEMON_API_RATE_LIMIT: 'La API de Pokémon TCG está saturada. Espera un minuto e inténtalo de nuevo',
  POKEMON_API_UNAVAILABLE: 'La API de Pokémon TCG no responde. Inténtalo más tarde',
  POKEMON_API_ERROR: 'No se pudieron obtener las cartas. Revisa los filtros e inténtalo de nuevo',
  POKEMON_API_NETWORK_ERROR: 'No se pudo conectar con la API de Pokémon TCG. Comprueba tu conexión',
};

export function messageForCode(code: string | undefined, fallback: string): string {
  if (code && ERROR_MESSAGES_ES[code]) return ERROR_MESSAGES_ES[code];
  return fallback;
}
