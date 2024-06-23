import * as path from 'path';
import * as fs from 'fs';

function isSfdxProjectRoot(): boolean {
  return fs.existsSync(path.resolve(process.cwd(), 'sfdx-project.json'));
}

function createDir(dir: string): void {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    throw new Error(`could not create directory ${dir}`);
  }
}

export { createDir, isSfdxProjectRoot };
