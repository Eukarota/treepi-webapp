/*
 * Référentiel des 54 pays africains : la première version de Treepi est
 * exclusivement destinée aux voyageurs africains, donc les champs
 * « Nationalité », « Pays de résidence » et l'indicatif téléphonique de
 * l'inscription se limitent à ce continent.
 *
 * Chaque entrée porte aussi les métadonnées téléphoniques du pays :
 * l'indicatif international et le gabarit du numéro national mobile
 * (« 6 XX XX XX XX » : chaque chiffre ou X est une position de chiffre,
 * les espaces sont le groupement d'affichage). Le gabarit pilote le
 * placeholder, le formatage à la saisie, le maxlength et la validation
 * côté client. Longueurs usuelles des numéros mobiles ; le vrai backend
 * fera foi (TODO API).
 */

export interface PaysAfricain {
  /** Code ISO 3166-1 alpha-2 (sert de valeur stable et de source du drapeau). */
  iso: string;
  nom: string;
  nomEn: string;
  nationalite: string;
  nationaliteEn: string;
  /** Indicatif international, avec le « + ». */
  indicatif: string;
  /** Gabarit du numéro national mobile (chiffres littéraux + X, espacés). */
  gabarit: string;
}

/** Trié par nom français (ordre d'affichage des listes). */
export const PAYS_AFRIQUE: PaysAfricain[] = [
  { iso: "ZA", nom: "Afrique du Sud", nomEn: "South Africa", nationalite: "Sud-africaine", nationaliteEn: "South African", indicatif: "+27", gabarit: "8X XXX XXXX" },
  { iso: "DZ", nom: "Algérie", nomEn: "Algeria", nationalite: "Algérienne", nationaliteEn: "Algerian", indicatif: "+213", gabarit: "5XX XX XX XX" },
  { iso: "AO", nom: "Angola", nomEn: "Angola", nationalite: "Angolaise", nationaliteEn: "Angolan", indicatif: "+244", gabarit: "9XX XXX XXX" },
  { iso: "BJ", nom: "Bénin", nomEn: "Benin", nationalite: "Béninoise", nationaliteEn: "Beninese", indicatif: "+229", gabarit: "01 XX XX XX XX" },
  { iso: "BW", nom: "Botswana", nomEn: "Botswana", nationalite: "Botswanaise", nationaliteEn: "Botswanan", indicatif: "+267", gabarit: "7X XXX XXX" },
  { iso: "BF", nom: "Burkina Faso", nomEn: "Burkina Faso", nationalite: "Burkinabè", nationaliteEn: "Burkinabè", indicatif: "+226", gabarit: "XX XX XX XX" },
  { iso: "BI", nom: "Burundi", nomEn: "Burundi", nationalite: "Burundaise", nationaliteEn: "Burundian", indicatif: "+257", gabarit: "XX XX XX XX" },
  { iso: "CM", nom: "Cameroun", nomEn: "Cameroon", nationalite: "Camerounaise", nationaliteEn: "Cameroonian", indicatif: "+237", gabarit: "6 XX XX XX XX" },
  { iso: "CV", nom: "Cap-Vert", nomEn: "Cape Verde", nationalite: "Cap-verdienne", nationaliteEn: "Cape Verdean", indicatif: "+238", gabarit: "XXX XX XX" },
  { iso: "KM", nom: "Comores", nomEn: "Comoros", nationalite: "Comorienne", nationaliteEn: "Comorian", indicatif: "+269", gabarit: "XXX XX XX" },
  { iso: "CG", nom: "Congo", nomEn: "Congo", nationalite: "Congolaise (Congo-Brazzaville)", nationaliteEn: "Congolese (Congo-Brazzaville)", indicatif: "+242", gabarit: "06 XXX XX XX" },
  { iso: "CI", nom: "Côte d'Ivoire", nomEn: "Ivory Coast", nationalite: "Ivoirienne", nationaliteEn: "Ivorian", indicatif: "+225", gabarit: "07 XX XX XX XX" },
  { iso: "DJ", nom: "Djibouti", nomEn: "Djibouti", nationalite: "Djiboutienne", nationaliteEn: "Djiboutian", indicatif: "+253", gabarit: "77 XX XX XX" },
  { iso: "EG", nom: "Égypte", nomEn: "Egypt", nationalite: "Égyptienne", nationaliteEn: "Egyptian", indicatif: "+20", gabarit: "1X XXXX XXXX" },
  { iso: "ER", nom: "Érythrée", nomEn: "Eritrea", nationalite: "Érythréenne", nationaliteEn: "Eritrean", indicatif: "+291", gabarit: "7 XXX XXX" },
  { iso: "SZ", nom: "Eswatini", nomEn: "Eswatini", nationalite: "Eswatinienne", nationaliteEn: "Swazi", indicatif: "+268", gabarit: "7X XX XX XX" },
  { iso: "ET", nom: "Éthiopie", nomEn: "Ethiopia", nationalite: "Éthiopienne", nationaliteEn: "Ethiopian", indicatif: "+251", gabarit: "9X XXX XXXX" },
  { iso: "GA", nom: "Gabon", nomEn: "Gabon", nationalite: "Gabonaise", nationaliteEn: "Gabonese", indicatif: "+241", gabarit: "0X XX XX XX" },
  { iso: "GM", nom: "Gambie", nomEn: "Gambia", nationalite: "Gambienne", nationaliteEn: "Gambian", indicatif: "+220", gabarit: "XXX XXXX" },
  { iso: "GH", nom: "Ghana", nomEn: "Ghana", nationalite: "Ghanéenne", nationaliteEn: "Ghanaian", indicatif: "+233", gabarit: "XX XXX XXXX" },
  { iso: "GN", nom: "Guinée", nomEn: "Guinea", nationalite: "Guinéenne", nationaliteEn: "Guinean", indicatif: "+224", gabarit: "6XX XX XX XX" },
  { iso: "GQ", nom: "Guinée équatoriale", nomEn: "Equatorial Guinea", nationalite: "Équato-guinéenne", nationaliteEn: "Equatorial Guinean", indicatif: "+240", gabarit: "XXX XXX XXX" },
  { iso: "GW", nom: "Guinée-Bissau", nomEn: "Guinea-Bissau", nationalite: "Bissau-guinéenne", nationaliteEn: "Bissau-Guinean", indicatif: "+245", gabarit: "9XX XXX XXX" },
  { iso: "KE", nom: "Kenya", nomEn: "Kenya", nationalite: "Kényane", nationaliteEn: "Kenyan", indicatif: "+254", gabarit: "7XX XXX XXX" },
  { iso: "LS", nom: "Lesotho", nomEn: "Lesotho", nationalite: "Lésothienne", nationaliteEn: "Basotho", indicatif: "+266", gabarit: "5X XXX XXX" },
  { iso: "LR", nom: "Liberia", nomEn: "Liberia", nationalite: "Libérienne", nationaliteEn: "Liberian", indicatif: "+231", gabarit: "77 XXX XXXX" },
  { iso: "LY", nom: "Libye", nomEn: "Libya", nationalite: "Libyenne", nationaliteEn: "Libyan", indicatif: "+218", gabarit: "9X XXX XXXX" },
  { iso: "MG", nom: "Madagascar", nomEn: "Madagascar", nationalite: "Malgache", nationaliteEn: "Malagasy", indicatif: "+261", gabarit: "3X XX XXX XX" },
  { iso: "MW", nom: "Malawi", nomEn: "Malawi", nationalite: "Malawienne", nationaliteEn: "Malawian", indicatif: "+265", gabarit: "9XX XX XX XX" },
  { iso: "ML", nom: "Mali", nomEn: "Mali", nationalite: "Malienne", nationaliteEn: "Malian", indicatif: "+223", gabarit: "XX XX XX XX" },
  { iso: "MA", nom: "Maroc", nomEn: "Morocco", nationalite: "Marocaine", nationaliteEn: "Moroccan", indicatif: "+212", gabarit: "6XX XX XX XX" },
  { iso: "MU", nom: "Maurice", nomEn: "Mauritius", nationalite: "Mauricienne", nationaliteEn: "Mauritian", indicatif: "+230", gabarit: "5XXX XXXX" },
  { iso: "MR", nom: "Mauritanie", nomEn: "Mauritania", nationalite: "Mauritanienne", nationaliteEn: "Mauritanian", indicatif: "+222", gabarit: "XX XX XX XX" },
  { iso: "MZ", nom: "Mozambique", nomEn: "Mozambique", nationalite: "Mozambicaine", nationaliteEn: "Mozambican", indicatif: "+258", gabarit: "8X XXX XXXX" },
  { iso: "NA", nom: "Namibie", nomEn: "Namibia", nationalite: "Namibienne", nationaliteEn: "Namibian", indicatif: "+264", gabarit: "81 XXX XXXX" },
  { iso: "NE", nom: "Niger", nomEn: "Niger", nationalite: "Nigérienne", nationaliteEn: "Nigerien", indicatif: "+227", gabarit: "9X XX XX XX" },
  { iso: "NG", nom: "Nigeria", nomEn: "Nigeria", nationalite: "Nigériane", nationaliteEn: "Nigerian", indicatif: "+234", gabarit: "8XX XXX XXXX" },
  { iso: "UG", nom: "Ouganda", nomEn: "Uganda", nationalite: "Ougandaise", nationaliteEn: "Ugandan", indicatif: "+256", gabarit: "7XX XXX XXX" },
  { iso: "CF", nom: "République centrafricaine", nomEn: "Central African Republic", nationalite: "Centrafricaine", nationaliteEn: "Central African", indicatif: "+236", gabarit: "XX XX XX XX" },
  { iso: "CD", nom: "République démocratique du Congo", nomEn: "Democratic Republic of the Congo", nationalite: "Congolaise (RDC)", nationaliteEn: "Congolese (DRC)", indicatif: "+243", gabarit: "8XX XXX XXX" },
  { iso: "RW", nom: "Rwanda", nomEn: "Rwanda", nationalite: "Rwandaise", nationaliteEn: "Rwandan", indicatif: "+250", gabarit: "78X XXX XXX" },
  { iso: "ST", nom: "São Tomé-et-Principe", nomEn: "São Tomé and Príncipe", nationalite: "Santoméenne", nationaliteEn: "São Toméan", indicatif: "+239", gabarit: "9XX XX XX" },
  { iso: "SN", nom: "Sénégal", nomEn: "Senegal", nationalite: "Sénégalaise", nationaliteEn: "Senegalese", indicatif: "+221", gabarit: "7X XXX XX XX" },
  { iso: "SC", nom: "Seychelles", nomEn: "Seychelles", nationalite: "Seychelloise", nationaliteEn: "Seychellois", indicatif: "+248", gabarit: "2 XXX XXX" },
  { iso: "SL", nom: "Sierra Leone", nomEn: "Sierra Leone", nationalite: "Sierra-léonaise", nationaliteEn: "Sierra Leonean", indicatif: "+232", gabarit: "XX XXX XXX" },
  { iso: "SO", nom: "Somalie", nomEn: "Somalia", nationalite: "Somalienne", nationaliteEn: "Somali", indicatif: "+252", gabarit: "6X XXX XXXX" },
  { iso: "SD", nom: "Soudan", nomEn: "Sudan", nationalite: "Soudanaise", nationaliteEn: "Sudanese", indicatif: "+249", gabarit: "9X XXX XXXX" },
  { iso: "SS", nom: "Soudan du Sud", nomEn: "South Sudan", nationalite: "Sud-soudanaise", nationaliteEn: "South Sudanese", indicatif: "+211", gabarit: "9X XXX XXXX" },
  { iso: "TZ", nom: "Tanzanie", nomEn: "Tanzania", nationalite: "Tanzanienne", nationaliteEn: "Tanzanian", indicatif: "+255", gabarit: "7XX XXX XXX" },
  { iso: "TD", nom: "Tchad", nomEn: "Chad", nationalite: "Tchadienne", nationaliteEn: "Chadian", indicatif: "+235", gabarit: "6X XX XX XX" },
  { iso: "TG", nom: "Togo", nomEn: "Togo", nationalite: "Togolaise", nationaliteEn: "Togolese", indicatif: "+228", gabarit: "9X XX XX XX" },
  { iso: "TN", nom: "Tunisie", nomEn: "Tunisia", nationalite: "Tunisienne", nationaliteEn: "Tunisian", indicatif: "+216", gabarit: "XX XXX XXX" },
  { iso: "ZM", nom: "Zambie", nomEn: "Zambia", nationalite: "Zambienne", nationaliteEn: "Zambian", indicatif: "+260", gabarit: "9X XXX XXXX" },
  { iso: "ZW", nom: "Zimbabwe", nomEn: "Zimbabwe", nationalite: "Zimbabwéenne", nationaliteEn: "Zimbabwean", indicatif: "+263", gabarit: "7X XXX XXXX" },
];

/** Drapeau emoji dérivé du code ISO (symboles indicateurs régionaux). */
export function drapeauEmoji(iso: string): string {
  return String.fromCodePoint(...[...iso.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/** Noms des pays africains dans la locale demandée (ordre du référentiel). */
export function nomsPaysAfrique(locale: string): string[] {
  return PAYS_AFRIQUE.map((p) => (locale === "en" ? p.nomEn : p.nom));
}

/** Nationalités africaines dans la locale demandée, triées alphabétiquement. */
export function nationalitesAfrique(locale: string): string[] {
  return PAYS_AFRIQUE.map((p) => (locale === "en" ? p.nationaliteEn : p.nationalite)).sort((a, b) =>
    a.localeCompare(b, locale)
  );
}

/** Nombre de chiffres attendus par un gabarit (positions littérales + X). */
export function chiffresAttendus(gabarit: string): number {
  return (gabarit.match(/[\dX]/g) ?? []).length;
}

/**
 * Formate une suite de chiffres selon le groupement du gabarit
 * (« 61234567 » + « 6 XX XX XX XX » -> « 6 12 34 56 7 »), en tronquant
 * au nombre de chiffres attendus.
 */
export function formaterNumero(chiffres: string, gabarit: string): string {
  const propres = chiffres.replace(/\D/g, "").slice(0, chiffresAttendus(gabarit));
  const groupes = gabarit.split(" ").map((g) => g.length);
  const morceaux: string[] = [];
  let position = 0;
  for (const taille of groupes) {
    if (position >= propres.length) break;
    morceaux.push(propres.slice(position, position + taille));
    position += taille;
  }
  return morceaux.join(" ");
}
