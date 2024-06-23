import * as path from 'path';
import * as fs from 'fs';
import { glob } from 'glob';
import { createDir } from '../../utils';
import { loader } from './loader';

function addGraphqlGlobsToForceignore(sfdxProjectDir: string): void {
  const forceIgnorePath = path.resolve(sfdxProjectDir, '.forceignore');
  if (!fs.existsSync(forceIgnorePath)) {
    fs.writeFileSync(forceIgnorePath, '**/*.graphql\n**/*.gql', { encoding: 'utf-8' });
  } else {
    let forceIgnore = fs.readFileSync(forceIgnorePath, { encoding: 'utf-8' });
    if (!/^\*\*\/\*\.graphql$/gm.test(forceIgnore)) {
      forceIgnore += '\n**/*.graphql';
    }
    if (!/^\*\*\/\*\.gql$/gm.test(forceIgnore)) {
      forceIgnore += '\n**/*.gql';
    }
    fs.writeFileSync(forceIgnorePath, forceIgnore, { encoding: 'utf-8' });
  }
}

//  TODO: component's backup could be done in parallel
//  TODO: backup only .js files instead of the whole lwc directory
function backupLightningComponentDirectories(backupDirectory: string, lightningComponentDirectories: string[]): void {
  createDir(backupDirectory);
  lightningComponentDirectories.forEach((lightningComponentDirectory) => {
    fs.cpSync(
      path.resolve(lightningComponentDirectory),
      path.resolve(backupDirectory, path.basename(lightningComponentDirectory)),
      {
        recursive: true,
      }
    );
  });
}

function fetchLightningComponentJsFilePaths(lightningComponentDirectories: string[]): Promise<string[]> {
  return glob(
    lightningComponentDirectories.map(
      (lightningComponentDirectoryPath) => `${lightningComponentDirectoryPath}/**/*.js`
    ),
    { ignore: '**/__tests__/**' }
  );
}

//  TODO: run in parallel with worker_threads || child_process
//  TODO: memory management
//  TODO: enable caching
function transformLightningComponentJsFiles(outputDirectory: string, jsFilePaths: string[]): void {
  for (const jsFilePath of jsFilePaths) {
    const transformedJsFile = loader(jsFilePath);
    fs.writeFileSync(path.resolve(outputDirectory, path.basename(jsFilePath)), transformedJsFile, {
      encoding: 'utf-8',
    });
  }
}

async function graphqlLoaderService(
  sfdxProjectDirectory: string,
  lightningComponentDirectories: string[]
): Promise<string[] | undefined> {
  const lightningComponentJsFilePaths = await fetchLightningComponentJsFilePaths(lightningComponentDirectories);
  if (!lightningComponentJsFilePaths?.length) return;
  const buildDirectory = path.resolve(sfdxProjectDirectory, '.loader', 'build');
  createDir(buildDirectory);
  backupLightningComponentDirectories(
    path.resolve(sfdxProjectDirectory, '.loader', 'backup', 'lwc'),
    lightningComponentDirectories
  );
  addGraphqlGlobsToForceignore(sfdxProjectDirectory);
  transformLightningComponentJsFiles(buildDirectory, lightningComponentJsFilePaths);
  return lightningComponentJsFilePaths;
}

export { graphqlLoaderService };
