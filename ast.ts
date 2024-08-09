export interface Node {
  start: number;
  end: number;
}
export interface Program {
  node: Node;
  body: Statement[];
}

interface Statement {}
export interface VariableDeclarationStatement {
  node: Node;
  variableDeclaration: VariableDeclaration;
}

export interface VariableDeclaration {
  node: Node;
  declarations: VariableDeclarator[];
  kind: "let";
}

export interface VariableDeclarator {
  node: Node;
  id: BindingIdentifier;
  init?: Expression;
}

export interface BindingIdentifier {
  node: Node;
  name: string;
}

interface Expression {}
export interface Literal {
  node: Node;
  value: string | number | boolean | null;
  type: "StringLiteral" | "NumericLiteral";
}
