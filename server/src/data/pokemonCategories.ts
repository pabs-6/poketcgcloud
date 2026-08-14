export type PokemonCategory =
  | 'legendary'
  | 'mythical'
  | 'pseudo-legendary'
  | 'ultra-beast'
  | 'paradox'
  | 'baby';

const LEGENDARY = new Set([
  144, 145, 146, 150, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384,
  480, 481, 482, 483, 484, 485, 486, 487, 488, 638, 639, 640, 641, 642, 645, 646,
  716, 717, 718, 772, 773, 785, 786, 787, 788, 791, 792, 800, 888, 889, 890, 894, 895,
  896, 897, 898, 1001, 1002, 1003, 1004, 1007, 1008, 1009, 1010, 1014, 1015, 1016, 1017, 1024,
]);

const MYTHICAL = new Set([
  151, 251, 385, 386, 489, 490, 491, 492, 493, 494, 647, 648, 649, 719, 720, 721, 801, 802,
  807, 808, 809, 893, 1025,
]);

const PSEUDO_LEGENDARY = new Set([
  147, 148, 149, 246, 247, 248, 371, 372, 373, 374, 375, 376, 443, 444, 445, 633, 634, 635,
  704, 705, 706, 782, 783, 784, 885, 886, 887, 996, 997, 998,
]);

const ULTRA_BEAST = new Set([793, 794, 795, 796, 797, 798, 799, 803, 804, 805, 806]);

const PARADOX = new Set([
  984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 1005, 1006, 1009, 1010,
  1020, 1021, 1022, 1023,
]);

const BABY = new Set([
  172, 173, 174, 175, 236, 238, 239, 240, 298, 360, 406, 433, 438, 439, 440, 446, 447, 458,
]);

export interface SpeciesFlags {
  isLegendary?: boolean;
  isMythical?: boolean;
  isBaby?: boolean;
}

export function getPokemonCategories(speciesId: number, flags?: SpeciesFlags): PokemonCategory[] {
  const categories: PokemonCategory[] = [];
  const isMythical = flags?.isMythical ?? MYTHICAL.has(speciesId);
  const isLegendary = flags?.isLegendary ?? LEGENDARY.has(speciesId);

  if (isMythical) categories.push('mythical');
  else if (isLegendary) categories.push('legendary');

  if (PSEUDO_LEGENDARY.has(speciesId)) categories.push('pseudo-legendary');
  if (ULTRA_BEAST.has(speciesId)) categories.push('ultra-beast');
  if (PARADOX.has(speciesId)) categories.push('paradox');
  if (flags?.isBaby ?? BABY.has(speciesId)) categories.push('baby');

  return categories;
}

export function hasSpecialCategory(categories: PokemonCategory[]): boolean {
  return categories.length > 0;
}
