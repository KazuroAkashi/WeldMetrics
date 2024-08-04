export class UtilService {
  isFloat(val: string) {
    const floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
    if (!floatRegex.test(val)) return false;

    const valfloat = parseFloat(val);
    if (isNaN(valfloat)) return false;
    return true;
  }

  isInt(val: string) {
    const intRegex = /^-?\d+$/;
    if (!intRegex.test(val)) return false;

    const intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
  }

  parseValue(
    val: string,
    col: Column,
    errors: { field: string; err: string }[] | null = null,
    list = false
  ) {
    if (!val) return null;

    if (list) {
      const items = val.split(",");
      const parsed: any[] = items.map((item) => {
        return this.parseValue(item, col, errors);
      });
      return parsed;
    }

    if (col.type === "INTEGER") {
      if (!this.isInt(val)) {
        errors?.push({ field: col.name, err: "int" });
      }
      return parseInt(val);
    }

    if (col.type === "FLOAT") {
      if (!this.isFloat(val)) {
        errors?.push({ field: col.name, err: "float" });
      }
      return parseFloat(val);
    }

    return val;
  }
}
