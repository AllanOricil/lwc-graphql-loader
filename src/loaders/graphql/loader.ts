import * as fs from 'fs';
import * as path from 'path';

type RegExpMatch = {
  match: string;
  start: number;
  end: number;
};

type GraphqlImport = {
  variableName: string;
  sourcePath: string;
};

const GRAPHQL_IMPORT_REGEX = /^import\s*(?<variablename>\w*)\s*from.*('|")(?<sourcepath>.*(graphql|gql))('|");{0,1}$/gm;

function replaceBetween(origin: string, startIndex: number, endIndex: number, insertion: string): string {
  return origin.substring(0, startIndex) + insertion + origin.substring(endIndex + 1);
}

function addGraphqlLibraries(jsFile: string): string {
  return jsFile.replaceAll(
    /import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*(lightning\/uiGraphQLApi)["'\s].*/gm,
    "import { gql, graphql } from 'lightning/uiGraphQLApi';"
  );
}

function removeGraphqlImports(jsFile: string): string {
  return jsFile.replace(GRAPHQL_IMPORT_REGEX, '');
}

function fetchGraphqlImports(jsFile: string): GraphqlImport[] {
  const graphqlImports = new Array<GraphqlImport>();
  for (const match of jsFile.matchAll(GRAPHQL_IMPORT_REGEX)) {
    if (match?.groups?.variablename && match?.groups?.sourcepath)
      graphqlImports.push({
        variableName: match?.groups?.variablename,
        sourcePath: match?.groups?.sourcepath,
      });
  }
  return graphqlImports;
}

function fetchWires(jsFile: string): RegExpMatch[] {
  const wires = new Array<RegExpMatch>();
  let match: RegExpExecArray | null;
  const WIRE_REGEX = /@wire(.|\s)*?\((.|\s)*?}(.|\s)*?\)/gi;
  while ((match = WIRE_REGEX.exec(jsFile))) {
    wires.push({
      match: match[0],
      start: WIRE_REGEX.lastIndex - match[0].length,
      end: WIRE_REGEX.lastIndex - 1,
    });
  }
  return wires;
}

function fetchGraphql(graphqlFilePath: string): string {
  return fs
    .readFileSync(graphqlFilePath, { encoding: 'utf-8' })
    .replaceAll(/(\r\n|\r|\n)/g, '')
    .replace(/\s\s+/g, ' ')
    .replace(/\t/g, ' ');
}

function replaceGraphqlQueries(
  jsFile: string,
  wires: RegExpMatch[],
  graphqlImports: GraphqlImport[],
  jsFilePath: string
): string {
  let displacement = 0;
  const jsFileDirectory = path.parse(jsFilePath).dir;
  wires.forEach((wire: RegExpMatch) => {
    const currentWireLength: number = wire.match.length;
    const graphqlImport = graphqlImports.find((gi: GraphqlImport) => wire.match.includes(gi.variableName));
    if (graphqlImport) {
      //  TODO: reduce number of file reads
      const graphql = fetchGraphql(path.resolve(jsFileDirectory, graphqlImport.sourcePath));
      const variableNameRegExp = new RegExp(`query.*?:.*\\b${graphqlImport.variableName}\\b.*,`, 'g');
      const newWire = wire.match.replace(variableNameRegExp, `query: gql\`${graphql}\`,`);
      const newWireMatchLength = newWire.length;
      jsFile = replaceBetween(jsFile, wire.start + displacement, wire.end + displacement, newWire);
      displacement += newWireMatchLength - currentWireLength;
    }
  });
  return jsFile;
}

function loader(jsFilePath: string): string {
  let jsFile: string = fs.readFileSync(jsFilePath, { encoding: 'utf-8' });
  const graphqlImports: GraphqlImport[] = fetchGraphqlImports(jsFile);
  const wires: RegExpMatch[] = fetchWires(jsFile);

  jsFile = replaceGraphqlQueries(jsFile, wires, graphqlImports, jsFilePath);
  jsFile = addGraphqlLibraries(jsFile);
  jsFile = removeGraphqlImports(jsFile);

  return jsFile;
}

export { loader };
