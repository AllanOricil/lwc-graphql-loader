import { Command, Hook } from '@oclif/core';

type HookOptions = {
  Command: Command.Class;
  argv: string[];
  commandId: string;
  result: SourceComponent[] | DeployResult;
};

type HookFunction = (this: Hook.Context, options: HookOptions) => unknown;

type SourceComponentType = {
  id: string;
  name: string;
  directoryName: string;
  inFolder: boolean;
  strictDirectoryName: boolean;
  supportsPartialDelete: boolean;
};

type DeployResult = {
  components: ComponentSet;
};

type ForceIgnore = {
  forceIgnoreDirectory: string;
};

type SourceComponent = {
  name: string;
  type: SourceComponentType;
  xml: string;
  content: string;
  forceIgnore: ForceIgnore;
};

type ComponentSet = {
  components: Map<string, SourceComponent>;
};
