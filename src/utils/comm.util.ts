export const now = (unit) => {
  const hrTime = process.hrtime();

  switch (unit) {
    case "milli":
      return hrTime[0] * 1000 + hrTime[1] / 1000000;

    case "micro":
      return hrTime[0] * 1000000 + hrTime[1] / 1000;

    case "nano":
    default:
      return hrTime[0] * 1000000000 + hrTime[1];
  }
};
export const deepClone = (obj: any, clonedObjects = new WeakMap()): any => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Check if the object has already been cloned
  if (clonedObjects.has(obj)) {
    return clonedObjects.get(obj);
  }
  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  const clone = Array.isArray(obj) ? [] : {};

  // Remember the cloned object to handle circular references
  clonedObjects.set(obj, clone);

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], clonedObjects);
    }
  }

  return clone;
};
export const excludedFields = (obj: any, fields: string[]) => {
  if (
    null === obj ||
    typeof obj !== "object" ||
    !Array.isArray(fields) ||
    !fields.length
  ) {
    return obj;
  }
  const cloned = deepClone(obj);
  for (const field of fields) {
    delete cloned[field];
  }
  return cloned;
};

export const toIntNumber = (data, min, max, defaultValue = null) => {
  const converted = Number.parseInt(data, 10);
  if (isNaN(converted)) {
    return defaultValue || data;
  }
  if (min && converted < min) {
    return min;
  }
  if (max && converted > max) {
    return max;
  }
  return converted;
};
