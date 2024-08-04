export const FILTER_OPERATIONS = [
  "<",
  "<=",
  "=",
  ">=",
  ">",
  "<>",
  "LIKE",
  "NOT LIKE",
  "IS NULL",
  "IS NOT NULL",
  "IN",
  "NOT IN",
  "BETWEEN",
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
