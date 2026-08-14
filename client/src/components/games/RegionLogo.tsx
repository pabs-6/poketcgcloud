import { cn } from '@/utils';

const REGION_STYLES: Record<string, { bg: string; text: string; accent: string }> = {
  Kanto: { bg: '#E53935', text: 'Kanto', accent: '#FFCDD2' },
  Johto: { bg: '#F9A825', text: 'Johto', accent: '#FFF9C4' },
  Hoenn: { bg: '#43A047', text: 'Hoenn', accent: '#C8E6C9' },
  Sinnoh: { bg: '#8E24AA', text: 'Sinnoh', accent: '#E1BEE7' },
  Teselia: { bg: '#546E7A', text: 'Teselia', accent: '#CFD8DC' },
  Unova: { bg: '#546E7A', text: 'Unova', accent: '#CFD8DC' },
  Kalos: { bg: '#EC407A', text: 'Kalos', accent: '#F8BBD0' },
  Alola: { bg: '#FB8C00', text: 'Alola', accent: '#FFE0B2' },
  'Galar / Hisui': { bg: '#1E88E5', text: 'Galar', accent: '#BBDEFB' },
  Paldea: { bg: '#7B1FA2', text: 'Paldea', accent: '#E1BEE7' },
  National: { bg: '#37474F', text: 'National', accent: '#B0BEC5' },
};

interface RegionLogoProps {
  region: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RegionLogo({ region, size = 'md', className }: RegionLogoProps) {
  const style = REGION_STYLES[region] ?? {
    bg: '#757575',
    text: region.split(' ')[0] ?? region,
    accent: '#EEEEEE',
  };
  const dim = size === 'sm' ? 40 : size === 'lg' ? 64 : 48;
  const fontSize = size === 'sm' ? 7 : size === 'lg' ? 9 : 8;

  return (
    <svg
      viewBox="0 0 48 48"
      width={dim}
      height={dim}
      className={cn('shrink-0 drop-shadow-sm', className)}
      aria-label={region}
      role="img"
    >
      <circle cx="24" cy="24" r="22" fill={style.bg} />
      <circle cx="24" cy="24" r="18" fill="none" stroke={style.accent} strokeWidth="2" opacity="0.85" />
      <text
        x="24"
        y="26"
        textAnchor="middle"
        fill="white"
        fontSize={fontSize}
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.5"
      >
        {style.text.toUpperCase()}
      </text>
    </svg>
  );
}
