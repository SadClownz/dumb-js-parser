import { test, expect } from "bun:test";
import { Parser } from "./parser";
test('parse let x = "kappa"', () => {
  const parser = new Parser('let x = "kappa";');
  const program = parser.parse();
  const expected = {
    body: [
      {
        node: {
          start: 3,
          end: 15,
        },
        declarations: [
          {
            node: {
              start: 3,
              end: 15,
            },
            id: {
              node: {
                start: 3,
                end: 5,
              },
              name: "x",
            },
            init: {
              node: {
                start: 7,
                end: 15,
              },
              value: '"kappa"',
              type: "StringLiteral",
            },
          },
        ],
        kind: "let",
      },
    ],
    node: {
      start: 0,
      end: 16,
    },
  };
  expect(program).toEqual(expected);
});
test("parse let x = 123", () => {
  const parser = new Parser("let x = 123;");
  const program = parser.parse();
  
  const expected = {
    body: [
      {
        node: {
          start: 3,
          end: 11,
        },
        declarations: [
          {
            node: {
              start: 3,
              end: 11,
            },
            id: {
              node: {
                start: 3,
                end: 5,
              },
              name: "x",
            },
            init: {
              node: {
                start: 7,
                end: 11,
              },
              value: 123,
              type: "NumericLiteral",
            },
          },
        ],
        kind: "let",
      },
    ],
    node: {
      start: 0,
      end: 12,
    },
  };
  expect(program).toEqual(expected);
});
