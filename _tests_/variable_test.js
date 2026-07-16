import Parser from "../parser.js"
import Interpreter from "../interpreter.js"


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

runTest("tri x=42;","x")
runTest("tri x=1;tri y=x+1;","y")
runTest("tri x=1;tri y=10;tri sum=x+y;","sum")
runTest("tri z=y+1;","z")
runTest("tri x=5; tri y = x > 1000;","y")

runTest(`
     tri x=6;
     tri y;
     if(x>=10){
      y="greater than 5 or less than 5";
     }elif(x>=5) {
      y="greater than 10";
     }else{
       y="less than 5";     
    }
    `,"y")