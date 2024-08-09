import type {
  Program,
  Node,
  VariableDeclarator,
  VariableDeclarationStatement,
  VariableDeclaration,
} from "./ast";
import { Kind, Lexer, Token } from "./lexer";
import assert from "node:assert";
export class Parser {
  source: string;
  lexer: Lexer;
  cur_token: Token;
  prev_token_end: number;
  constructor(source: string) {
    this.source = source;
    this.lexer = new Lexer(source);
    this.cur_token = new Token(Kind.default, 0, 0, null);
    this.prev_token_end = 0;
  }

  parse() {
    const program: Program = {
      body: [],
      node: {
        start: 0,
        end: this.source.length,
      },
    };
    this.cur_token = this.lexer.readNextToken();
    while (this.cur_token.kind !== Kind.EOF) {
      if (this.cur_token.kind === Kind.let) {
        program.body.push(this.parseVariableDeclarationStatement());
      }
      this.cur_token = this.lexer.readNextToken();
    }
    return program;
  }

  start_node(): Node {
    const token = this.cur_token;
    return {
      start: token.start,
      end: 0,
    };
  }
  finish_node(node: Node): Node {
    return {
      start: node.start,
      end: this.prev_token_end,
    };
  }

  at(kind: number) {
    return this.cur_token.kind === kind;
  }
  bump(kind: number) {
    if (this.at(kind)) {
      this.advance();
    }
  }
  bumb_any() {
    this.advance();
  }

  eat(kind: number) {
    if (this.at(kind)) {
      this.advance();
      return true;
    }
    return false;
  }

  advance() {
    const token = this.lexer.readNextToken();
    this.prev_token_end = this.cur_token.end;
    this.cur_token = token;
  }
  expect(kind: number) {
    if (this.at(kind)) {
      this.advance();
    } else {
      assert.fail(
        `Expected token of kind ${kind}, but got ${this.cur_token.kind}`
      );
    }
  }
  parseVariableDeclarationStatement() {
    this.expect(Kind.let);
    const variableDeclaration = this.parseVariableDeclaration();
    this.expect(Kind.semicolon);
    return variableDeclaration;
  }
  parseVariableDeclaration(): VariableDeclaration {
    const node = this.start_node();
    const id = this.parseBindingIdentifier();
    let init = undefined;
    if (this.eat(Kind.Assignment)) {
      init = this.parseExpression();
    }
    const declarator: VariableDeclarator = {
      node: this.finish_node(node),
      id,
      init,
    };
    return {
      node: this.finish_node(node),
      declarations: [declarator],
      kind: "let",
    };
  }
  parseBindingIdentifier() {
    const node = this.start_node();
    let token = this.cur_token;
    this.expect(Kind.Identifier);
    return {
      node: this.finish_node(node),
      name: token.tokenValue,
    };
  }
  parseExpression() {
    const node = this.start_node();
    let token = this.cur_token;
    if (this.eat(Kind.String)) {
      return {
        node: this.finish_node(node),
        value: token.tokenValue,
        type: "StringLiteral",
      };
    } else if (this.eat(Kind.Number)) {
      return {
        node: this.finish_node(node),
        value: token.tokenValue,
        type: "NumericLiteral",
      };
    }
    return undefined;
  }
}
