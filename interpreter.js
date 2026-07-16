import Environment from './environment.js'


class Interpreter {
    constructor(global = GlobalEnvironment) {
        this.global = global;
    }
    interpret(node) {
        return this.StatementList(node);
    }
    StatementList(body, env = this.global) {
        let result;
        for (const statement of body) {
            result = this.Statement(statement, env);
        }
        return result;
    }
    Statement(node, env) {
        switch (node.type) {
            case "ExpressionStatement":
                return this.ExpressionStatement(node.expression, env);
            case "VariableStatement":
                return this.VariableStatement(node.declarations, env)
            case "BlockStatement":
                return this.BlockStatement(node.body, env)
            case "IfStatement":
                return this.IfStatement(node, env);
            case "ConditionalExpression":
                return this.ConditionalExpression(node,env);   
            case "WhileStatement":
                return this.WhileStatement(node,env);  
            case "DoWhileStatement":
                return this.DoWhileStatement(node,env);
            case "ForStatement":
                return this.ForStatement(node, env);      
            case "FunctionDeclaration":
                return this.FunctionDeclaration(node,env);
            case "ReturnStatement":
                return this.ReturnStatement(node,env);        
            default:
                throw new SyntaxError(`Unknown type : ${node.type}`)         
        }
    }


    FunctionDeclaration(node,env){
        let name=node.name.name;
        let functionBody={
            name:name,
            params:node.params,
            body:node.body,
            env,
        }
        return env.define(name,functionBody);
    }



    ReturnStatement(node,env){
        return this.Expression(node.argument,env);
    }

    ForStatement(node,env){
        let res;
        for(
           this.Statement(node.init,env);
           this.Expression(node.test,env);
           this.Expression(node.update,env)
        ){
            res=this.Statement(node.body,env);
        }
        return res;
    }


   ConditionalExpression(node,env){
    return this.Expression(node.test,env)?this.Expression(node.consequent,env):this.Expression(node.alternate,env);
   }


    IfStatement(node, env) {
        const testResult = this.Expression(node.test, env);
        if (testResult) {
            return this.Statement(node.consequent, env)
        } else if (node.alternate) return this.Statement(node.alternate, env);
        else return null;
    }

    BlockStatement(node, env) {
        const blockEnv = new Environment({},env)
        return this.StatementList(node, blockEnv);
    }

    VariableStatement(node, env) {
        return node.map((declaration) => this.VariableDeclaration(declaration, env));
    }

    VariableDeclaration(node, env) {
        let id = node.id.name;
        let init = node.init !== null ? this.Expression(node.init, env) : 0;
        env.define(id, init)
    }

    ExpressionStatement(expression, env) {
        return this.Expression(expression, env)
    }
    Expression(node, env) {
        switch (node.type) {
            case "NumericLiteral":
                return this.NumericLiteral(node);
            case "StringLiteral":
                return this.StringLiteral(node)
            case "BooleanLiteral":
                return this.BooleanLiteral(node)
            case "NullLiteral":
                return this.NullLiteral(node)
            case "Identifier":
                return this.Identifier(node, env)
            case "AssignmentExpression":
                return this.AssignmentExpression(node, env)
            case "BinaryExpression":
            case "LogicalORExpression":
            case "LogicalANDExpression":
                return this.BinaryExpression(node, env);
            case "CallExpression":
                return this.CallExpression(node,env);    
            default:
                throw new SyntaxError(`Unknown statement type : ${node.type}`);        

        }
    }



     CallExpression(node,env){
        if(node.calle.name=="write"){
            return this.callWriteExpression(node,env);
        }
        let fn=env.lookup(node.calle.name)

        let args=node.arguments.map((args)=>this.Expression(args,env))
        let params=fn.params.map((param)=>param.name)



        let activationRecord={};
        params.forEach((param,index)=>{
            activationRecord[param]=args[index];
        })

         const acenv=new Environment(activationRecord,fn.env);
         return this.Statement(fn.body,acenv);
     }




      callWriteExpression(node,env){
        let args=node.arguments.map((args)=>this.Expression(args,env))
        return console.log(...args);
      }

    WhileStatement(node,env){
        let result;
        while(this.Expression(node.test,env)){
            result=this.Statement(node.body,env);
        }
        return result;
    }


   DoWhileStatement(node,env){
    let res;
    do{
      res=this.Statement(node.body,env)
    }while(this.Expression(node.test,env))
    return res;
   }


    BinaryExpression(node, env) {
        switch (node.operator) {
            case "+":
            case "-":
            case "*":
            case "/":
            case "%":
                return this.MathExpression(node, env)
            case "==":
            case "!=":
            case "<":
            case ">":
            case "<=":
            case ">=":
                return this.RelationalExpression(node, env)
            case "&&":
                return this.Expression(node.left, env) && this.Expression(node.right, env);
            case "||":
                return this.Expression(node.left, env) || this.Expression(node.right, env);
            default:
                throw new SyntaxError(`Unknown operator: ${node.operator}`);
        }
    }

    RelationalExpression(node, env) {
        let left = this.Expression(node.left, env)
        let right = this.Expression(node.right, env)
        switch (node.operator) {
            case "==":
                return left == right;
            case "!=":
                return left != right;
            case "<":
                return left < right;
            case ">":
                return left > right;
            case "<=":
                return left <= right;
            case ">=":
                return left >= right;
        }
    }
    MathExpression(node, env) {
        let left = this.Expression(node.left, env)
        let right = this.Expression(node.right, env)
        switch (node.operator) {
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "*":
                return left * right;
            case "/":
                return left / right;
            case "%":
                return left % right;
        }
    }

    AssignmentExpression(node, env) {
        if (node.operator == "=") return this.SimpleAssign(node, env);
        else return this.ComplexAssign(node, env);
    }

    SimpleAssign(node, env) {
        const varname = node.left.name;
        const value = this.Expression(node.right, env);
        env.assign(varname, value)
        return value;
    }


    ComplexAssign(node, env) {
        let left = node.left.name;
        let right = this.Expression(node.right, env)

        const operator = node.operator[0]
        const leftvalue = env.lookup(left)


        if (typeof right == "string" && typeof leftvalue == "string" && operator !== "+") {
            throw new SyntaxError("Invalid operation");
        }

        switch (operator) {
            case "+":
                right = leftvalue + right;
                break;
            case "-":
                right = leftvalue - right;
                break;
            case "*":
                right = leftvalue * right;
                break;
            case "/":
                right = leftvalue / right;
                break;
        }
        env.assign(left, right)
        return;
    }


    Identifier(node, env) {
        return env.lookup(node.name)
    }


    NumericLiteral(node) {
        return node.value;
    }

    StringLiteral(node) {
        return node.value
    }
    BooleanLiteral(node) {
        return node.value;
    }
    NullLiteral(node) {
        return node.value;
    }
}


const GlobalEnvironment = new Environment({
    null: null,
    true: true,
    false: false,
    version: 1.0,
})

export default Interpreter;