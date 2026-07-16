import Parser from "./parser.js"
import Interpreter from "./interpreter.js"


function runTest(input, variableToCheck) {
    const parser = new Parser()
    const ast = parser.parse(input)
    const interpreter = new Interpreter()
    const result = interpreter.interpret(ast.body);


    if (variableToCheck) {
        try {
            const value = interpreter.global.lookup(variableToCheck)
            console.log(`${variableToCheck}=`, value)
        } catch (e) {
            console.error(`${e.message}`)
        }
    } else {
        console.log(`Execution result: `, result);
    }

}

runTest(`
     tri x=10;
     while(x<15){
     x+=1;
     }
    `,"x")

runTest(`
     tri x=10;
     for(tri i=0;i<5;i+=1){
      x=x+i;
     }
    `,"x")