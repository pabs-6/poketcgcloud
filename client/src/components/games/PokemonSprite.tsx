import { cn } from '@/utils';

interface PokemonSpriteProps {
  speciesId: number;
  sprite: string;
  shinySprite: string;
  shiny?: boolean;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

function shinyFallbackUrl(speciesId: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${speciesId}.png`;
}

function normalFallbackUrl(speciesId: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`;
}

export function PokemonSprite({
  speciesId,
  sprite,
  shinySprite,
  shiny = false,
  alt,
  className,
  loading = 'lazy',
}: PokemonSpriteProps) {
  const src = shiny ? shinySprite : sprite;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        if (shiny) {
          if (img.src !== shinyFallbackUrl(speciesId)) {
            img.src = shinyFallbackUrl(speciesId);
            return;
          }
          if (img.src !== normalFallbackUrl(speciesId)) {
            img.src = normalFallbackUrl(speciesId);
          }
          return;
        }
        if (img.src !== normalFallbackUrl(speciesId)) {
          img.src = normalFallbackUrl(speciesId);
        }
      }}
    />
  );
}
