import Parser from "./parser.js"
import Interpreter from "./interpreter.js"


function runTest(input) {
    const parser = new Parser()
    const ast = parser.parse(input)
    const interpreter = new Interpreter()
    const result = interpreter.interpret(ast.body);
}

runTest(`tri res;
      def fact(n,m){
       return n+m;
     }
     res=fact(5,8);
     write(res);
    `)