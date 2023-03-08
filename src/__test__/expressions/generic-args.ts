import _ from "lodash-es";
import * as ast from "../../ast";
import * as utils from "../utils";
import { identifierTemplates } from "./identifier";
import { literalExpressions } from "./literal";
import { typeReferenceExpressions } from "./type-reference";
import type { Expression } from "./";
import { unionExpressions } from "./union";
import { SyntaxKind } from "../../ast/constants";

export { expressions as genericArgsExpressions };

const expressions: Record<"native" | "extended", Expression[]> = {
  native: [],
  extended: [],
};

const permutedIdGroup = utils.permuteObjects(identifierTemplates, 1, 3);

const otherExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ..._.sampleSize(unionExpressions.all, 100),
];

let i = 0;
permutedIdGroup.forEach((ids) => {
  const args: Partial<
    Record<keyof ast.GenericArgsExpression["values"][number], utils.TestNode>
  >[] = [];

  ids.forEach((id) => {
    args.push({
      id: utils.createNode({
        instance: ast.IdentifierExpression,
        output: id,
      }),
      ...(i === 0
        ? {
            default: _.sample(otherExpressions)!.node,
          }
        : i === 1
        ? {
            type: _.sample(otherExpressions)!.node,
          }
        : {
            default: _.sample(otherExpressions)!.node,
            type: _.sample(otherExpressions)!.node,
          }),
    });
    i++;
    if (i === 3) i = 0;
  });

  const generateContent = (isNative: boolean) => {
    return utils.mergeString(
      "<",
      args
        .map((arg) => {
          let str = arg.id!.output;
          if (arg.type)
            str += ` ${isNative ? "extends" : ":"} ${arg.type.output}`;
          if (arg.default) str += ` = ${arg.default.output}`;

          return str;
        })
        .join(", "),
      ">"
    );
  };

  expressions.native.push({
    content: generateContent(true),
    node: utils.createNode({
      instance: ast.GenericArgsExpression,
      output: generateContent(true),
      kind: SyntaxKind.E.GenericArgs,
      values: args,
    }),
  });

  expressions.extended.push({
    content: generateContent(false),
    node: utils.createNode({
      instance: ast.GenericArgsExpression,
      output: generateContent(true),
      kind: SyntaxKind.E.GenericArgs,
      values: args,
    }),
  });
});
