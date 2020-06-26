export const prefix = <T extends string>(sourceArr: T[], prefix: string) => {
  return sourceArr.reduce<Record<T, string>>((prev, curr, i) => {
    prev[curr as string] = `${prefix}-${curr}`;
    return prev;
  }, {} as any);
};
