import getLogger from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

const importOne = async (path: string, property = 'default'): Promise<any> => {
  let module = null;
  try {
    module = await import(path);
  } catch (err) {
    logger.error(err);
  }
  return module ? module[property] : null;
};

const importMany = async (pathList: string[], property = 'default'): Promise<any[]> => {
  try {
    let items = [];
    if (pathList && pathList.length > 0) {
      items = await Promise.all(
        pathList.map(async (path) => {
          try {
            const imported = await import(path);
            logger.debug(`Imported module: ${path}`);
            return imported[property];
          } catch (err) {
            logger.warn(`Failed to import: ${path}`);
            return null;
          }
        })
      );
    }
    return items.filter((i) => i !== null);
  } catch (err) {
    logger.error(err);
    return [];
  }
};

export default { importOne, importMany };
