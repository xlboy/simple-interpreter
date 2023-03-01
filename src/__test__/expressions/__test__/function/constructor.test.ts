import { it } from "vitest";
import * as ast from "../../../../ast";
import { functionExpressions } from "../..";
import * as utils from "../../../utils";

it("normal", () => {
  functionExpressions.constructor.forEach((expr) => {
    utils.assertSource({
      content: `type B = ${expr.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type B = ${expr.node.output};`,
          value: expr.node,
        }),
      ],
    });
  });
});
