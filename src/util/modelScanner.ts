import { FileOptions } from './consts';
import { ListDir } from './fileHelper';
import { importMany, importOne } from './importHelper';
import { getLogger } from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

/**
 * Scan the model path and return a list of models as string array
 */
export const getModelList = async (): Promise<string[]> => {
  let result: string[] = [];
  try {
    const models = await ListDir(`${__dirname}/../models`, FileOptions.files);
    // remove file extension
    result = models.map((model: string) => model.slice(0, -3));
    logger.debug(`Scanned models: ${models}`);
  } catch (err) {
    logger.error(err);
  }
  return result;
};

/**
 * Scan the model path and return a list of models
 */
export const getModels = async (): Promise<any> => {
  const models = await getModelList();
  return importMany(models);
};

/**
 * Find a import a specific model
 */
export const getModel = async (modelName: string): Promise<any> => {
  return importOne(`../model/${modelName}`);
};
