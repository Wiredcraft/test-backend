/**
 * # View Service
 *
 * Using [ejs](https://ejs.co/) to render view for page.
 *
 * Templates located at `src/view`.
 *
 * ## Injected Dependency
 *
 * No injected item found.
 *
 * @module
 */
import { join } from 'path';
import { renderFile, Data } from 'ejs';
import { Provide } from '../util/container';
import { access } from 'fs/promises';

@Provide()
export class ViewService {
  async render(tmpName: string, data: Data = {}) {
    const filePath = await this.getFilePath(tmpName);
    return renderFile(filePath, data);
  }

  private async getFilePath(tmpName: string) {
    const filePath = join(__dirname, `../view/${tmpName}.ejs`);
    await access(filePath);
    return filePath;
  }
}
