import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";

export { TupleExpression };

// [1, 2, 3, "", "a", Array[number]]
const schema = zod.tuple([
  zod.any() /* [ */,
  zod.array(zod.instanceof(ExpressionBase)) /* 1, 2, 3, ...items */,
  zod.any() /* ] */,
]);

type Schema = zod.infer<typeof schema>;

class TupleExpression extends ExpressionBase<Schema> {
  public kind = AST.SyntaxKind.E.Tuple;

  public values: Schema[1];

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.values] = args;
  }

  public compile(): string {
    const content = this.values.map((v) => v.compile()).join(", ");

    return `[${content}]`;
  }

  public toString(): string {
    return this.kind;
  }
}
