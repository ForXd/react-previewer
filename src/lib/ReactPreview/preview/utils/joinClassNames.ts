export function joinClassNames(...values: Array<string | undefined | false>): string {
  return values.filter(Boolean).join(' ');
}
