import { DeployResult, HookFunction, HookOptions } from '../../typings';
import { transformedJsFilePaths } from '../predeploy';
import { IS_SFDX_PROJECT_ROOT, SFDX_PROJECT_DIR, LOADER_DIR, BACKUP_DIR } from '../../index';

export const hook: HookFunction = function (options: HookOptions) {
  if (IS_SFDX_PROJECT_ROOT) {
    const result: DeployResult = options.result as DeployResult;
    if (SFDX_PROJECT_DIR && result) {
      this.log('--------- START POST DEPLOY HOOK: GRAPHQL LOADER ----------');
      this.log(LOADER_DIR);
      this.log(BACKUP_DIR);
      this.log(SFDX_PROJECT_DIR);
      this.log(transformedJsFilePaths);
      this.log('--------- END POST DEPLOY HOOK: GRAPHQL LOADER ----------');
    }
  }
};
