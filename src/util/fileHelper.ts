import { promises as fsPromises } from 'fs';
import { join } from 'path';

import { FileOptions } from './consts';
import { getLogger } from './logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));
const { readdir, stat } = fsPromises;

/**
 * ListDir
 * @param path the path of directory
 * @param option one of the fileOptions
 * @returns list of filenames in target directory
 */
export const ListDir = async (path: string, option = FileOptions.all): Promise<string[]> => {
  try {
    const files = await readdir(path);
    const dirs = await Promise.all(
      files
        .filter(async (file) => {
          const result = await stat(join(path, file));
          switch (option) {
            case FileOptions.dirs:
              return result.isDirectory();
            case FileOptions.files:
              return !result.isDirectory();
            case FileOptions.all:
            default:
              return true;
          }
        })
        .map((file) => JSON.stringify(file).replace(/"/gm, ''))
    );

    return dirs;
  } catch (err) {
    logger.error(err);
    return [];
  }
};
