import { HookFunction, HookOptions, SourceComponent } from '../../typings';
import { IS_SFDX_PROJECT_ROOT, SFDX_PROJECT_DIR } from '../../index';
import { graphqlLoaderService } from '../../loaders/graphql';

// TODO: is there another way exchange data between pre/post hooks?
export let transformedJsFilePaths: string[] | undefined;

function fetchLightningComponentDirectories(srcComponents: SourceComponent[]): string[] {
  return srcComponents
    .filter((srcComponent) => srcComponent.type?.name === 'LightningComponentBundle' && srcComponent?.xml)
    .map((srcComponent) => `${srcComponent.content}`);
}

export const hook: HookFunction = async function (options: HookOptions) {
  try {
    if (!IS_SFDX_PROJECT_ROOT) {
      this.warn('loader only runs from the root of sfdx projects');
    } else {
      this.log('--------- start loader ----------');
      const srcComponents: SourceComponent[] = options.result as SourceComponent[];
      if (srcComponents?.length) {
        const lightningComponentDirectories = fetchLightningComponentDirectories(srcComponents);
        if (!lightningComponentDirectories?.length) {
          this.log("skipping because there aren't any lightning components to process");
          return;
        }

        this.log('lightning components that are going to be processed:');
        this.log(lightningComponentDirectories);

        transformedJsFilePaths = await graphqlLoaderService(SFDX_PROJECT_DIR, lightningComponentDirectories);
        if (transformedJsFilePaths?.length) {
          this.log('changed .js files');
          this.log(transformedJsFilePaths);
        } else {
          this.log('no .js files were transformed');
        }

        this.log('--------- end loader ----------');
      }
    }
  } catch (err: unknown) {
    this.error('something went wrong');
    if (err instanceof Error) {
      this.error(err);
    }
    this.exit(1);
  }
};
