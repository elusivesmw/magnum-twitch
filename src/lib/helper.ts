export function getUniqueBy(arr: any[], prop: string) {
  return arr.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t[prop] === item[prop])
  );
}
