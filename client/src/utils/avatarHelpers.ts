import i18n from '@/i18n';

const MAX_AVATAR_BYTES = 300_000;
const OUTPUT_SIZE = 256;

export async function prepareAvatarFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error(i18n.t('profile.invalidImageFile'));
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(i18n.t('profile.imageTooLarge'));
  }

  const dataUrl = await resizeImage(file, OUTPUT_SIZE);
  const approxBytes = Math.ceil((dataUrl.length * 3) / 4);

  if (approxBytes > MAX_AVATAR_BYTES) {
    throw new Error(i18n.t('profile.imageStillTooLarge'));
  }

  return dataUrl;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(i18n.t('profile.imageReadError')));
    };
    img.src = url;
  });
}

async function resizeImage(file: File, size: number): Promise<string> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error(i18n.t('profile.imageProcessError'));

  const scale = Math.max(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;

  ctx.drawImage(img, x, y, w, h);

  const webp = canvas.toDataURL('image/webp', 0.85);
  if (webp.length < MAX_AVATAR_BYTES * 1.4) return webp;

  return canvas.toDataURL('image/jpeg', 0.82);
}
