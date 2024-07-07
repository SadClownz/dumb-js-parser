export const Kind = {
  EOF: 0,
  Number: 1,
  Plus: 2,
  Minus: 3,
  Star: 4,
  Slash: 5,
  LParen: 6,
  RParen: 7,
  Identifier: 8,
  If: 9,
  While: 10,
  For: 11,
  String: 13,
  LBrace: 14,
  RBrace: 15,
  Assignment: 16,
  let: 17,

  semicolon: 18,
  function: 19,
  comma: 20,
  return: 21,
  class: 22,
  Equal: 23,
  NotEqual: 24,
  StrictEqual: 25,
  LessThan: 26,
  GreaterThan: 27,
  LessThanOrEqual: 28,
  GreaterThanOrEqual: 29,
  Not: 30,
  And: 31,
  Or: 32,
  LogicalAnd: 33,
  LogicalOr: 34,
  DoubleQuote: 35,
  Period: 36,
  LBracket: 37,
  RBracket: 38,
  this: 39,
  True: 40,
  False: 41,
  SingleLineComment: 42,
  MultiLineComment: 43,
  JSDocComment: 44,
  Const: 45,
} as const;

type Kind = typeof Kind;

export class Token {
  constructor(
    public kind: number,
    public start: number,
    public end: number,
    public tokenValue: any,
  ) {}
}

export class Lexer {
  constructor(
    public source: string,
    public chars: string[] = source.split(""),
  ) {}

  #readNextKind(): number {
    let char = this.chars.shift();
    while (char) {
      char = char.trim().toLowerCase();
      switch (char) {
        case "&": {
          if (this.#peek() === "&") {
            this.chars.shift();
            return Kind.And;
          }
          return Kind.LogicalAnd;
        }
        case "|": {
          if (this.#peek() === "|") {
            this.chars.shift();
            return Kind.Or;
          }
          return Kind.LogicalOr;
        }
        case '"': {
          while (this.chars.length > 0 && this.chars[0] !== '"') {
            this.chars.shift();
          }
          // skip the closing quote
          this.chars.shift();
          return Kind.String;
        }
        case "/": {
          if (this.#peek() === "/") {
            while (this.chars.length > 0 && this.chars[0] !== "\n") {
              this.chars.shift();
            }
            return Kind.SingleLineComment;
          }
          if (this.#peek() === "*") {
            const possibleToken =
              this.#peekNext() === "*"
                ? Kind.JSDocComment
                : Kind.MultiLineComment;
            while (this.chars.length > 0) {
              if (this.chars[0] === "*" && this.#peek() === "/") break;
              this.chars.shift();
            }
            // skip the closing star
            this.chars.shift();
            return possibleToken;
          }
          throw new Error("Invalid token");
        }
        case "[":
          return Kind.LBracket;
        case "]":
          return Kind.RBracket;
        case ".":
          return Kind.Period;
        case "+":
          return Kind.Plus;
        case "-":
          return Kind.Minus;
        case "*":
          return Kind.Star;
        case "/":
          return Kind.Slash;
        case "(":
          return Kind.LParen;
        case ")":
          return Kind.RParen;
        case "{":
          return Kind.LBrace;
        case "}":
          return Kind.RBrace;
        case "<": {
          if (this.#peek() === "=") {
            this.chars.shift();
            return Kind.LessThanOrEqual;
          }
          return Kind.LessThan;
        }
        case ">":
          if (this.#peek() === "=") {
            this.chars.shift();
            return Kind.GreaterThanOrEqual;
          }
          return Kind.GreaterThan;
        case "=": {
          if (this.#peek() === "=") {
            this.chars.shift();
            if (this.#peek() === "=") {
              this.chars.shift();
              return Kind.StrictEqual;
            }
            return Kind.Equal;
          }
          return Kind.Assignment;
        }
        case ";":
          return Kind.semicolon;
        case ",":
          return Kind.comma;
        default:
          if (char >= "0" && char <= "9") {
            let number = char;
            while (
              (this.chars.length > 0 &&
                this.chars[0] >= "0" &&
                this.chars[0] <= "9") ||
              this.chars[0] === "." ||
              this.chars[0] === "_"
            ) {
              number += this.chars.shift();
            }
            return Kind.Number;
          }
          if (char >= "a" && char <= "z") {
            let keyword = char;
            while (
              this.chars.length > 0 &&
              this.chars[0] >= "a" &&
              this.chars[0] <= "z"
            ) {
              keyword += this.chars.shift();
            }
            return this.#matchKeyword(keyword);
          }
      }
      char = this.chars.shift();
    }
    return Kind.EOF;
  }

  #matchKeyword(keyword: string): number {
    // all keywords are 1<= length <= 10
    if (keyword.length === 1 || keyword.length > 10) return Kind.Identifier;

    switch (keyword) {
      case "if":
        return Kind.If;
      case "while":
        return Kind.While;
      case "for":
        return Kind.For;
      case "let":
        return Kind.let;
      case "const":
        return Kind.Const;
      case "function":
        return Kind.function;
      case "return":
        return Kind.return;
      case "class":
        return Kind.class;
      case "this":
        return Kind.this;
      case "true":
        return Kind.True;
      case "false":
        return Kind.False;
      default:
        return Kind.Identifier;
    }
  }
  readNextToken() {
    let start = this.#offset();
    let kind = this.#readNextKind();
    let end = this.#offset();
    let tokenValue: any = this.source.slice(start, end).trim();
    if (kind === Kind.Number) {
      tokenValue = Number.parseFloat(tokenValue);
    }
    return new Token(kind, start, end, tokenValue);
  }
  #offset() {
    return this.source.length - this.chars.length;
  }
  #peek() {
    return this.chars[0];
  }
  #peekNext() {
    return this.chars[1];
  }
}
