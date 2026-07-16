import Tokenizer from './tokenizer.js';
import Parser from './parser.js'
import Interpreter from './interpreter.js'
// const tokenizer = new Tokenizer();
// tokenizer.init("5 + 3;");


// let token;

// while (token = tokenizer.getNextToken()) {
//     console.log(token);
// }

const program="tri x=5;"
const parser=new Parser();
const ast=parser.parse(program)
console.log(JSON.stringify(ast,null,2));

// const interpreter=new Interpreter()
// const result=interpreter.interpret(ast.body)
// console.log(result)