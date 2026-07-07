export type ColumnVisibility<T extends string> = Record<T, boolean>;

export function loadColumnVisibility<T extends string>(
  storageKey: string,
  defaults: ColumnVisibility<T>
): ColumnVisibility<T> {
  try {
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
      return defaults;
    }

    const parsed = JSON.parse(saved);
    const keys = Object.keys(defaults) as T[];
    const isValid = keys.every((key) => typeof parsed[key] === "boolean");

    if (!isValid) {
      localStorage.removeItem(storageKey);
      return defaults;
    }

    return keys.reduce((columns, key) => {
      columns[key] = parsed[key];
      return columns;
    }, {} as ColumnVisibility<T>);
  } catch {
    localStorage.removeItem(storageKey);
    return defaults;
  }
}

export function visibleColumnCount<T extends string>(
  columns: ColumnVisibility<T>,
  extraColumns = 0
) {
  return Object.values(columns).filter(Boolean).length + extraColumns;
}
