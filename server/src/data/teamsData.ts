export interface TeamMember {
  speciesId: number;
  roleEs: string;
  roleEn: string;
  natureEs: string;
  natureEn: string;
  movesEs: string[];
  movesEn: string[];
}

export interface CuratedTeam {
  id: string;
  gameSlug: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  members: TeamMember[];
}

export const CURATED_TEAMS: CuratedTeam[] = [
  {
    id: 'emerald-balanced',
    gameSlug: 'emerald',
    nameEs: 'Equipo equilibrado (History)',
    nameEn: 'Balanced team (Story)',
    descriptionEs: 'Cobertura de tipos para la liga de Hoenn sin complicaciones.',
    descriptionEn: 'Type coverage for the Hoenn league without overcomplicating.',
    members: [
      {
        speciesId: 260,
        roleEs: 'Iniciador Agua',
        roleEn: 'Water starter',
        natureEs: 'Modesta (+Sp. Atk, -Atk)',
        natureEn: 'Modest (+Sp. Atk, -Atk)',
        movesEs: ['Pistola Agua', 'Rayo Hielo', 'Día Soleado', 'Terremoto'],
        movesEn: ['Water Pulse', 'Ice Beam', 'Sunny Day', 'Earthquake'],
      },
      {
        speciesId: 282,
        roleEs: 'Soporte psíquico',
        roleEn: 'Psychic support',
        natureEs: 'Modesta',
        natureEn: 'Modest',
        movesEs: ['Psíquico', 'Reflejo', 'Barrera de Luz', 'Recuperación'],
        movesEn: ['Psychic', 'Reflect', 'Light Screen', 'Recover'],
      },
      {
        speciesId: 334,
        roleEs: 'Dragón volador',
        roleEn: 'Flying dragon',
        natureEs: 'Modesta',
        natureEn: 'Modest',
        movesEs: ['Dragoaliento', 'Rayo Hielo', 'Descanso', 'Protección'],
        movesEn: ['Dragon Breath', 'Ice Beam', 'Rest', 'Protect'],
      },
      {
        speciesId: 289,
        roleEs: 'Tanque normal',
        roleEn: 'Normal tank',
        natureEs: 'Relajado (+Def, -Spe)',
        natureEn: 'Relaxed (+Def, -Spe)',
        movesEs: ['Giga Impacto', 'Shadow Ball', 'Descanso', 'Protección'],
        movesEn: ['Giga Impact', 'Shadow Ball', 'Rest', 'Protect'],
      },
      {
        speciesId: 359,
        roleEs: 'Oscuro físico',
        roleEn: 'Physical dark',
        natureEs: 'Jovial (+Spe, -Sp. Def)',
        natureEn: 'Jolly (+Spe, -Sp. Def)',
        movesEs: ['Persecución', 'Sorpresa', 'Shadow Ball', 'Protección'],
        movesEn: ['Pursuit', 'Sucker Punch', 'Shadow Ball', 'Protect'],
      },
      {
        speciesId: 306,
        roleEs: 'Acero roca',
        roleEn: 'Steel rock',
        natureEs: 'Adamante (+Atk, -Sp. Atk)',
        natureEn: 'Adamant (+Atk, -Sp. Atk)',
        movesEs: ['Terremoto', 'Piedra Filo', 'Explosión', 'Protección'],
        movesEn: ['Earthquake', 'Rock Slide', 'Explosion', 'Protect'],
      },
    ],
  },
  {
    id: 'scarlet-story',
    gameSlug: 'scarlet',
    nameEs: 'Equipo history Paldea',
    nameEn: 'Paldea story team',
    descriptionEs: 'Buen balance para la liga y el postgame de Escarlata/Púrpura.',
    descriptionEn: 'Solid balance for the Paldea league and postgame.',
    members: [
      {
        speciesId: 911,
        roleEs: 'Iniciador fuego',
        roleEn: 'Fire starter',
        natureEs: 'Modesta',
        natureEn: 'Modest',
        movesEs: ['Flamethrower', 'Shadow Ball', 'Encanto', 'Protección'],
        movesEn: ['Flamethrower', 'Shadow Ball', 'Encore', 'Protect'],
      },
      {
        speciesId: 918,
        roleEs: 'Trampa veneno',
        roleEn: 'Poison trapper',
        natureEs: 'Jovial',
        natureEn: 'Jolly',
        movesEs: ['U-turn', 'Shadow Sneak', 'Toxic Spikes', 'Knock Off'],
        movesEn: ['U-turn', 'Shadow Sneak', 'Toxic Spikes', 'Knock Off'],
      },
      {
        speciesId: 700,
        roleEs: 'Hada eléctrico',
        roleEn: 'Fairy electric',
        natureEs: 'Modesta',
        natureEn: 'Modest',
        movesEs: ['Moonblast', 'Thunderbolt', 'Psyshock', 'Calm Mind'],
        movesEn: ['Moonblast', 'Thunderbolt', 'Psyshock', 'Calm Mind'],
      },
      {
        speciesId: 445,
        roleEs: 'Dragón/Ground',
        roleEn: 'Dragon/Ground',
        natureEs: 'Jovial',
        natureEn: 'Jolly',
        movesEs: ['Earthquake', 'Dragon Claw', 'Iron Head', 'Swords Dance'],
        movesEn: ['Earthquake', 'Dragon Claw', 'Iron Head', 'Swords Dance'],
      },
      {
        speciesId: 149,
        roleEs: 'Dragón clásico',
        roleEn: 'Classic dragon',
        natureEs: 'Adamante',
        natureEn: 'Adamant',
        movesEs: ['Dragon Dance', 'Outrage', 'Earthquake', 'Fire Punch'],
        movesEn: ['Dragon Dance', 'Outrage', 'Earthquake', 'Fire Punch'],
      },
      {
        speciesId: 376,
        roleEs: 'Acero psíquico',
        roleEn: 'Steel psychic',
        natureEs: 'Modesta',
        natureEn: 'Modest',
        movesEs: ['Flash Cannon', 'Psychic', 'Thunderbolt', 'Calm Mind'],
        movesEn: ['Flash Cannon', 'Psychic', 'Thunderbolt', 'Calm Mind'],
      },
    ],
  },
  {
    id: 'platinum-story',
    gameSlug: 'platinum',
    nameEs: 'Equipo Sinnoh clásico',
    nameEn: 'Classic Sinnoh team',
    descriptionEs: 'Equipo versátil para la aventura en Sinnoh.',
    descriptionEn: 'Versatile team for the Sinnoh adventure.',
    members: [
      {
        speciesId: 395,
        roleEs: 'Iniciador agua',
        roleEn: 'Water starter',
        natureEs: 'Modesta',
        natureEn: 'Modest',
        movesEs: ['Surf', 'Ice Beam', 'Flash Cannon', 'Grass Knot'],
        movesEn: ['Surf', 'Ice Beam', 'Flash Cannon', 'Grass Knot'],
      },
      {
        speciesId: 448,
        roleEs: 'Luchador veloz',
        roleEn: 'Fast fighter',
        natureEs: 'Jovial',
        natureEn: 'Jolly',
        movesEs: ['Close Combat', 'Mach Punch', 'Stone Edge', 'Swords Dance'],
        movesEn: ['Close Combat', 'Mach Punch', 'Stone Edge', 'Swords Dance'],
      },
      {
        speciesId: 445,
        roleEs: 'Dragón/Ground',
        roleEn: 'Dragon/Ground',
        natureEs: 'Jovial',
        natureEn: 'Jolly',
        movesEs: ['Earthquake', 'Dragon Claw', 'Fire Fang', 'Swords Dance'],
        movesEn: ['Earthquake', 'Dragon Claw', 'Fire Fang', 'Swords Dance'],
      },
      {
        speciesId: 476,
        roleEs: 'Acero eléctrico',
        roleEn: 'Steel electric',
        natureEs: 'Modesta',
        natureEn: 'Modest',
        movesEs: ['Flash Cannon', 'Thunderbolt', 'Thunder Wave', 'Light Screen'],
        movesEn: ['Flash Cannon', 'Thunderbolt', 'Thunder Wave', 'Light Screen'],
      },
      {
        speciesId: 143,
        roleEs: 'Tanque normal',
        roleEn: 'Normal tank',
        natureEs: 'Cuidadosa (+Sp. Def, -Sp. Atk)',
        natureEn: 'Careful (+Sp. Def, -Sp. Atk)',
        movesEs: ['Body Slam', 'Earthquake', 'Rest', 'Sleep Talk'],
        movesEn: ['Body Slam', 'Earthquake', 'Rest', 'Sleep Talk'],
      },
      {
        speciesId: 487,
        roleEs: 'Fantasma/Dragón',
        roleEn: 'Ghost/Dragon',
        natureEs: 'Modesta',
        natureEn: 'Modest',
        movesEs: ['Shadow Ball', 'Dragon Pulse', 'Thunderbolt', 'Calm Mind'],
        movesEn: ['Shadow Ball', 'Dragon Pulse', 'Thunderbolt', 'Calm Mind'],
      },
    ],
  },
  {
    id: 'red-classic',
    gameSlug: 'red',
    nameEs: 'Equipo Kanto clásico',
    nameEn: 'Classic Kanto team',
    descriptionEs: 'Los clásicos de Kanto para completar la liga original.',
    descriptionEn: 'Kanto classics to beat the original league.',
    members: [
      {
        speciesId: 3,
        roleEs: 'Iniciador planta',
        roleEn: 'Grass starter',
        natureEs: 'Modesta',
        natureEn: 'Modest',
        movesEs: ['Razor Leaf', 'Sleep Powder', 'Leech Seed', 'Body Slam'],
        movesEn: ['Razor Leaf', 'Sleep Powder', 'Leech Seed', 'Body Slam'],
      },
      {
        speciesId: 9,
        roleEs: 'Iniciador agua',
        roleEn: 'Water starter',
        natureEs: 'Modesta',
        natureEn: 'Modest',
        movesEs: ['Surf', 'Ice Beam', 'Dig', 'Rest'],
        movesEn: ['Surf', 'Ice Beam', 'Dig', 'Rest'],
      },
      {
        speciesId: 6,
        roleEs: 'Iniciador fuego',
        roleEn: 'Fire starter',
        natureEs: 'Modesta',
        natureEn: 'Modest',
        movesEs: ['Flamethrower', 'Earthquake', 'Slash', 'Fire Spin'],
        movesEn: ['Flamethrower', 'Earthquake', 'Slash', 'Fire Spin'],
      },
      {
        speciesId: 25,
        roleEs: 'Eléctrico rápido',
        roleEn: 'Fast electric',
        natureEs: 'Jovial',
        natureEn: 'Jolly',
        movesEs: ['Thunderbolt', 'Quick Attack', 'Thunder Wave', 'Double Team'],
        movesEn: ['Thunderbolt', 'Quick Attack', 'Thunder Wave', 'Double Team'],
      },
      {
        speciesId: 143,
        roleEs: 'Tanque normal',
        roleEn: 'Normal tank',
        natureEs: 'Adamante',
        natureEn: 'Adamant',
        movesEs: ['Body Slam', 'Earthquake', 'Rest', 'Sleep Talk'],
        movesEn: ['Body Slam', 'Earthquake', 'Rest', 'Sleep Talk'],
      },
      {
        speciesId: 149,
        roleEs: 'Dragón final',
        roleEn: 'Final dragon',
        natureEs: 'Adamante',
        natureEn: 'Adamant',
        movesEs: ['Hyper Beam', 'Blizzard', 'Thunder', 'Agility'],
        movesEn: ['Hyper Beam', 'Blizzard', 'Thunder', 'Agility'],
      },
    ],
  },
];

export function getTeamsForGame(gameSlug: string): CuratedTeam[] {
  return CURATED_TEAMS.filter((t) => t.gameSlug === gameSlug);
}

export function getTeamById(id: string): CuratedTeam | undefined {
  return CURATED_TEAMS.find((t) => t.id === id);
}

export function getGamesWithTeams(): string[] {
  return [...new Set(CURATED_TEAMS.map((t) => t.gameSlug))];
}
