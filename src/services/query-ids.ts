/** Query ids as an array, whether sent repeated (ids=1&ids=2, ids[]=1), alone (ids=1) or comma separated (ids=1,2). */
export function queryIds(
  value: string | string[] | undefined,
): string[] | undefined {
  if (value === undefined) return undefined;
  return ([] as string[])
    .concat(value)
    .join(',')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id !== '');
}
