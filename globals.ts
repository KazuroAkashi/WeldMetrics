export const FILTER_OPERATIONS = [
  "<",
  "<=",
  "=",
  ">=",
  ">",
  "Eşit Değil",
  "Benzer",
  "Benzer Değil",
  "Boş",
  "Boş Değil",
  "Dahil",
  "Hariç",
  "Aralıkta",
];

export const FILTER_OPERATIONS_TEMPLATES = [
  "< ?",
  "<= ?",
  "= ?",
  ">= ?",
  "> ?",
  "<> ?",
  "LIKE ?",
  "NOT LIKE ?",
  "IS NULL",
  "IS NOT NULL",
  "IN",
  "NOT IN",
  "BETWEEN ? AND ?",
];

export const FILTER_OPERATIONS_PARAMETER_COUNTS = [
  1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 2,
];

export const FILTER_OPERATIONS_USABLE = [
  ["INTEGER", "FLOAT"],
  ["INTEGER", "FLOAT"],
  ["INTEGER", "FLOAT", "VARCHAR"],
  ["INTEGER", "FLOAT"],
  ["INTEGER", "FLOAT"],
  ["INTEGER", "FLOAT", "VARCHAR"],
  ["VARCHAR"],
  ["VARCHAR"],
  ["INTEGER", "FLOAT", "VARCHAR"],
  ["INTEGER", "FLOAT", "VARCHAR"],
  ["INTEGER", "FLOAT", "VARCHAR"],
  ["INTEGER", "FLOAT", "VARCHAR"],
  ["INTEGER", "FLOAT"],
];

export const FILTER_OPERATIONS_SUGGEST = [
  false,
  false,
  true,
  false,
  false,
  true,
  false,
  false,
  false,
  false,
  true,
  true,
  false,
];

export const FILTER_OPERATIONS_LIST = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  true,
  false,
];
