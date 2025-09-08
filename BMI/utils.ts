export const isStringNumber = (str: string) => !isNaN(Number(str));

export const isStringNumberArr = (arr: string[]) =>
  arr.every((el) => isStringNumber(el));

export const makeNumberArr = (arr: string[]) => arr.map((el) => Number(el));
