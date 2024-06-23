import * as path from 'path';
import * as process from 'process';
import { isSfdxProjectRoot } from './utils';
import { createDir } from './utils';

const IS_SFDX_PROJECT_ROOT: boolean = isSfdxProjectRoot();
const SFDX_PROJECT_DIR: string = process.cwd();
const LOADER_DIR: string = path.resolve(SFDX_PROJECT_DIR, '.loader');
const BACKUP_DIR: string = path.resolve(LOADER_DIR, 'backup', 'lwc');
createDir(LOADER_DIR);

export { IS_SFDX_PROJECT_ROOT, SFDX_PROJECT_DIR, LOADER_DIR, BACKUP_DIR };
