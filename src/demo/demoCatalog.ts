import type { DemoDefinition } from './examples/types';
export type { DemoDefinition } from './examples/types';
import { overviewDemo } from './examples/overviewDemo';
import { usersDemo } from './examples/usersDemo';
import { routingDemo } from './examples/routingDemo';
import { compileErrorDemo } from './examples/compileErrorDemo';
import { dependencyErrorDemo } from './examples/dependencyErrorDemo';
import { runtimeErrorDemo } from './examples/runtimeErrorDemo';

export const demoCatalog: readonly DemoDefinition[] = [
  overviewDemo,
  usersDemo,
  routingDemo,
  compileErrorDemo,
  dependencyErrorDemo,
  runtimeErrorDemo
];
