import _ from 'lodash-es';

import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as utils from '../utils';
import type { Expression } from '.';
import { bracketSurroundExpressions } from './bracket-surround';
import { elementAccessExpressions } from './element-access';
import { literalExpressions } from './literal';
import { objectExpressions } from './object';
import { tupleExpressions } from './tuple';
import { typeReferenceExpressions } from './type-reference';

export { expressions as keyofExpressions };

const otherExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ..._.sampleSize(tupleExpressions, 1000),
  ..._.sampleSize(elementAccessExpressions, 1000),
  ..._.sampleSize(objectExpressions.all, 1000),
  ..._.sampleSize(bracketSurroundExpressions, 1000)
];

const expressions: Expression[] = otherExpressions.map(expr => ({
  content: `keyof       ${expr.content}`,
  node: utils.createNode({
    instance: ast.KeyofExpression,
    kind: SyntaxKind.E.Keyof,
    outputStr: `keyof ${expr.node.outputStr}`,
    source: expr.node
  })
}));
