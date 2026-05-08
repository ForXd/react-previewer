export const createFilesHash = (files: Record<string, string>): string => {
  let hash = 2166136261;
  const update = (value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
  };

  Object.keys(files)
    .sort()
    .forEach((fileName) => {
      update(fileName);
      update('\0');
      update(files[fileName] ?? '');
      update('\0');
    });

  return hash.toString(36);
};

export const createDepsHash = (depsInfo: Record<string, string> = {}): string =>
  Object.keys(depsInfo)
    .sort()
    .map((key) => `${key}@${depsInfo[key]}`)
    .join('|');

export const createStylesHash = (
  dependencyStyles: Record<string, string | string[]> = {}
): string =>
  Object.keys(dependencyStyles)
    .sort()
    .map((key) => {
      const value = dependencyStyles[key];
      return `${key}:${Array.isArray(value) ? value.join(',') : value}`;
    })
    .join('|');
