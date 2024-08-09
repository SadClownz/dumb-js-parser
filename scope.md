# Basic lex, parse and execute text case
```js
let x = 123;
let y = 2;

let z = x * y + 12 - 10;
let rand = (Math.random() * 100) + z / 100
if(rand > 50) {
    let out = "Won lottery rand z";
    console.log(out);
} 
```
# lex and parse Test
```js
function sum(arg1,arg2) {
    return arg1 + arg2
}

console.log(sum(1,10))
```
# Can lex
[X] - Let variables
[X] - Varaible binding
[X] - basic arithmetics
[X] - object method access
[X] - function with args

# Can parse
[X] - Let variables
[X] - Varaible binding
[] - basic arithmetics
[] - object method access
[] - function with args