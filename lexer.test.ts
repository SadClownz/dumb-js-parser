import { expect, test } from "bun:test";
import { Lexer,Kind, Token } from "./lexer";

test("lex 2 + 3", () => {
    const lexer = new Lexer("2 + 3");
    let token = lexer.readNextToken();
    let tokens:Token[] = []
    while( token.kind !== Kind.EOF ) {
        tokens.push(token);
        token = lexer.readNextToken();
    }
    expect(tokens.length).toBe(3);
    expect(tokens[0].kind).toBe(Kind.Number);

    expect(tokens[0].tokenValue).toBe(2);
    expect(tokens[1].kind).toBe(Kind.Plus);
    expect(tokens[1].tokenValue).toBe('+');
    expect(tokens[2].kind).toBe(Kind.Number);
    expect(tokens[2].tokenValue).toBe(3);
})

test("lex 2 + 3 * 4", () => {
    const lexer = new Lexer("2 + 3 * 4");
    let token = lexer.readNextToken();
    let tokens:Token[] = []
    while( token.kind !== Kind.EOF ) {
        tokens.push(token);
        token = lexer.readNextToken();
    }
    expect(tokens.length).toBe(5);
    expect(tokens[0].kind).toBe(Kind.Number);
    expect(tokens[0].tokenValue).toBe(2);
    expect(tokens[1].kind).toBe(Kind.Plus);
    expect(tokens[1].tokenValue).toBe('+');
    expect(tokens[2].kind).toBe(Kind.Number);
    expect(tokens[2].tokenValue).toBe(3);
    expect(tokens[3].kind).toBe(Kind.Star);
    expect(tokens[3].tokenValue).toBe('*');
    expect(tokens[4].kind).toBe(Kind.Number);
    expect(tokens[4].tokenValue).toBe(4);
})

test("lex let x = 2", () => {
    const lexer = new Lexer("let x = 2");
    let token = lexer.readNextToken();
    let tokens:Token[] = []
    while( token.kind !== Kind.EOF ) {
        tokens.push(token);
        token = lexer.readNextToken();
    }
    expect(tokens.length).toBe(4);
    expect(tokens[0].kind).toBe(Kind.let);
    expect(tokens[0].tokenValue).toBe('let');
    expect(tokens[1].kind).toBe(Kind.Identifier);
    expect(tokens[1].tokenValue).toBe('x');
    expect(tokens[2].kind).toBe(Kind.Assignment);
    expect(tokens[2].tokenValue).toBe('=');
    expect(tokens[3].kind).toBe(Kind.Number);
    expect(tokens[3].tokenValue).toBe(2);
})

test("lex let x = 2 + 3;", () => {
    const lexer = new Lexer("let x = 2 + 3;");
    let token = lexer.readNextToken();
    let tokens:Token[] = []
    while( token.kind !== Kind.EOF ) {
        tokens.push(token);
        token = lexer.readNextToken();
    }
    expect(tokens.length).toBe(7);
    expect(tokens[0].kind).toBe(Kind.let);
    expect(tokens[0].tokenValue).toBe('let');
    expect(tokens[1].kind).toBe(Kind.Identifier);
    expect(tokens[1].tokenValue).toBe('x');
    expect(tokens[2].kind).toBe(Kind.Assignment);
    expect(tokens[2].tokenValue).toBe('=');
    expect(tokens[3].kind).toBe(Kind.Number);
    expect(tokens[3].tokenValue).toBe(2);
    expect(tokens[4].kind).toBe(Kind.Plus);
    expect(tokens[4].tokenValue).toBe('+');
    expect(tokens[5].kind).toBe(Kind.Number);
    expect(tokens[5].tokenValue).toBe(3);
    expect(tokens[6].kind).toBe(Kind.semicolon);
    expect(tokens[6].tokenValue).toBe(';');
}) 

test("lex 2.5 + 3.5", () => {
    const lexer = new Lexer("2.5 + 3.5");
    let token = lexer.readNextToken();
    let tokens:Token[] = []
    while( token.kind !== Kind.EOF ) {
        tokens.push(token);
        token = lexer.readNextToken();
    }
    expect(tokens.length).toBe(3);
    expect(tokens[0].kind).toBe(Kind.Number);
    expect(tokens[0].tokenValue).toBe(2.5);
    expect(tokens[1].kind).toBe(Kind.Plus);
    expect(tokens[1].tokenValue).toBe('+');
    expect(tokens[2].kind).toBe(Kind.Number);
    expect(tokens[2].tokenValue).toBe(3.5);
})

test("lex function add(x,y) { return x + y; }", () => {
    let input = `function add(x,y) { return x + y; }`;
    const lexer = new Lexer(input);
    let token = lexer.readNextToken();
    let tokens:Token[] = []
    while( token.kind !== Kind.EOF ) {
        tokens.push(token);
        token = lexer.readNextToken();
    }
    let expectedTokens = [
        Kind.function, Kind.Identifier, Kind.LParen, Kind.Identifier, Kind.comma, Kind.Identifier, Kind.RParen, Kind.LBrace, Kind.return, Kind.Identifier, Kind.Plus, Kind.Identifier, Kind.semicolon, Kind.RBrace
    ]
    expect(tokens.length).toBe(14);
    for(let i = 0; i < tokens.length; i++) {
        expect(tokens[i].kind).toBe(expectedTokens[i]);
    }
})

test("lex if (x == 2) { return x; }", () => {
    let input = `if (x == 2) { return x; }`;
    const lexer = new Lexer(input);
    let token = lexer.readNextToken();
    let tokens:Token[] = []
    while( token.kind !== Kind.EOF ) {
        tokens.push(token);
        token = lexer.readNextToken();
    }
    let expectedTokens = [
        Kind.If, Kind.LParen, Kind.Identifier, Kind.Equal, Kind.Number, Kind.RParen, Kind.LBrace, Kind.return, Kind.Identifier, Kind.semicolon, Kind.RBrace
    ]
    expect(tokens.length).toBe(11);
    for(let i = 0; i < tokens.length; i++) {
        expect(tokens[i].kind).toBe(expectedTokens[i]);
    }
})

test("lex x === 3", () => {
    let input = `x === 3`;
    const lexer = new Lexer(input);
    let token = lexer.readNextToken();
    let tokens:Token[] = []
    while( token.kind !== Kind.EOF ) {
        tokens.push(token);
        token = lexer.readNextToken();
    }
    let expectedTokens = [
        Kind.Identifier, Kind.StrictEqual, Kind.Number
    ]
    expect(tokens.length).toBe(3);
    for(let i = 0; i < tokens.length; i++) {
        expect(tokens[i].kind).toBe(expectedTokens[i]);
    }
})