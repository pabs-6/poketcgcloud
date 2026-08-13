import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { UserIcon } from '@/components/icons/Icons';
import { prepareAvatarFile } from '@/utils/avatarHelpers';

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ open, onClose }: ProfileEditModalProps) {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null | undefined>(undefined);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && user) {
      setUsername(user.username);
      setAvatarPreview(undefined);
      setRemoveAvatar(false);
      setError('');
    }
  }, [open, user]);

  if (!user) return null;

  const displayAvatar = removeAvatar
    ? null
    : avatarPreview !== undefined
      ? avatarPreview
      : user.avatar;

  const usernameChanged = username.trim() !== user.username;
  const avatarChanged = removeAvatar || avatarPreview !== undefined;
  const hasChanges = usernameChanged || avatarChanged;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    try {
      const dataUrl = await prepareAvatarFile(file);
      setAvatarPreview(dataUrl);
      setRemoveAvatar(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.processImageError'));
    } finally {
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!hasChanges) {
      onClose();
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload: { username?: string; avatar?: string | null } = {};

      if (usernameChanged) {
        payload.username = username.trim();
      }

      if (avatarChanged) {
        payload.avatar = removeAvatar ? null : avatarPreview ?? null;
      }

      await updateProfile(payload);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.saveError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t('profile.editModalTitle')}>
      <div className="space-y-5">
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

        <div className="flex flex-col items-center gap-4">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt=""
              className="h-32 w-32 rounded-full object-cover ring-4 ring-poke-red/20"
            />
          ) : (
            <span className="flex h-32 w-32 items-center justify-center rounded-full bg-poke-red/10 text-poke-red ring-4 ring-poke-red/20">
              <UserIcon className="h-14 w-14" />
            </span>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-wrap gap-2 justify-center">
            <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              {t('profile.chooseImage')}
            </Button>
            {(displayAvatar || user.avatar) && !removeAvatar && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRemoveAvatar(true);
                  setAvatarPreview(undefined);
                }}
              >
                {t('profile.removePhoto')}
              </Button>
            )}
          </div>

          <p className="text-xs text-poke-gray-500 text-center">
            {t('profile.fileHint')}
          </p>
        </div>

        <Input
          label={t('profile.username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength={2}
          maxLength={30}
          required
        />

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            {t('profile.cancel')}
          </Button>
          <Button className="flex-1" onClick={handleSave} loading={loading}>
            {t('profile.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
