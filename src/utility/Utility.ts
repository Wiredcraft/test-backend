import * as Joi from "@hapi/joi";

export const genDbKey = (pattern: string, values: { [key: string]: string | number }): string => {
  let result = pattern;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(key, value as string);
  }
  return result;
};

export const validateWithJoi = async (schema: Joi.AnySchema, data: any): Promise<{ error: Error, value: any }> => {
  try {
    return {
      error: null,
      value: await schema.validateAsync(data),
    };
  } catch (err) {
    return {
      error: err,
      value: null,
    };
  }
};

export function arrDeleteIndex(targetArr: any[], index: number) {
  targetArr.splice(index, 1);
  return targetArr;
}
