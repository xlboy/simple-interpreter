import * as ast from "../../../ast";
import * as utils from "../../utils";
import { Expression } from "../types";
import { arrowExpressions } from "./arrow";

export { expressions as constructorExpressions };

const expressions: Expression[] = arrowExpressions.map((expr) => {
  return {
    content: `new ${expr.content}`,
    node: utils.createNode({
      instance: ast.Function.Mode.ConstructorExpression,
      output: `new ${expr.node.output}`,
      body: expr.node,
    }),
  };
});