import _ from 'lodash-es';

import * as ast from '../../../ast';
import { SyntaxKind } from '../../../ast/constants';
import * as utils from '../../utils';
import type { Expression } from '../';
import { arrayExpressions } from '../array';
import { bracketSurroundExpressions } from '../bracket-surround';
import { conditionExpressions, inferExpressions } from '../condition';
import { elementAccessExpressions } from '../element-access';
import { identifierTemplates } from '../identifier';
import { intersectionExpressions } from '../intersection';
import { literalExpressions } from '../literal';
import { tupleExpressions } from '../tuple';
import { typeReferenceExpressions } from '../type-reference';
import { unionExpressions } from '../union';

export { expressions as returnExpressions };

const otherExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ...tupleExpressions.slice(0, 3000),
  ...elementAccessExpressions.slice(0, 3000),
  ...bracketSurroundExpressions.slice(0, 3000),
  ...arrayExpressions.slice(0, 3000),
  ...conditionExpressions.all.slice(0, 200),
  ...inferExpressions.all.slice(0, 3000),
  ...unionExpressions.all.slice(0, 3000),
  ...intersectionExpressions.all.slice(0, 3000)
];

const expressions: Record<'assertAndIs' | 'isOnly' | 'normal', Expression[]> = {
  assertAndIs: [],
  isOnly: [],
  normal: []
};

let i = 0;

for (const expr of otherExpressions) {
  const id = i % 2 === 0 ? 'this' : _.sample(identifierTemplates)!;
  const assertSource: any =
    i % 2 === 0
      ? utils.createNode({
          instance: ast.LiteralKeywordExpression,
          outputStr: 'this'
        })
      : utils.createNode({
          instance: ast.IdentifierExpression,
          outputStr: id
        });

  expressions.assertAndIs.push({
    content: utils.mergeString('asserts ', id, ' is ', expr.content),
    node: utils.createNode({
      instance: ast.Function.Return.Expression,
      kind: SyntaxKind.E.FunctionReturn,
      outputStr: utils.mergeString('asserts ', id, ' is ', expr.node.outputStr!),
      assertSource,
      type: 'aserrt-is',
      target: expr.node
    })
  });

  expressions.isOnly.push({
    content: utils.mergeString(id, ' is ', expr.content),
    node: utils.createNode({
      instance: ast.Function.Return.Expression,
      kind: SyntaxKind.E.FunctionReturn,
      outputStr: utils.mergeString(id, ' is ', expr.node.outputStr!),
      assertSource,
      type: 'is',
      target: expr.node
    })
  });

  expressions.normal.push({
    content: expr.content,
    node: utils.createNode({
      instance: ast.Function.Return.Expression,
      kind: SyntaxKind.E.FunctionReturn,
      outputStr: expr.node.outputStr,
      target: expr.node
    })
  });

  i++;
}
