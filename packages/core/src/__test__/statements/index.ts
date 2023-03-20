import type { TestNode } from '../utils';

export { declareVariableStatements } from './declare-variable';
export { declareFunctionStatements } from './declare-function';
export { enumStatements } from './enum';
export { interfaceStatements } from './interface';

export type { Statement };

interface Statement {
  content: string;
  node: TestNode;
}
