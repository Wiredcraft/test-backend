export function stripUndefined<T>(x: T, deep = false) {
  return stripValue(x, undefined, deep) as {
    [K in keyof T]-?: Exclude<T[K], undefined>;
  };
}

function stripValue<T>(x: T, v: unknown, deep = false): T {
  if (typeof x === 'object' && x) {
    if (Array.isArray(x)) {
      if (!deep) return x;
      return (x.map((child: unknown) =>
        stripValue(child, v, deep),
      ) as unknown) as T;
    } else {
      const result = {} as T;
      for (const key of Object.keys(x) as Array<keyof typeof x>) {
        const value = x[key];
        if (value === v) continue;
        result[key] = deep ? stripValue(value, v, deep) : value;
      }
      return result;
    }
  }
  return x;
}
