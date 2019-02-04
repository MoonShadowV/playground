import {syntaxTree} from './interface';


export function evaluate(expr:syntaxTree,scope:Object){
    if(expr.type === "value"){
        return expr.value;
    }
    else if(expr.type === "word"){
        if(expr.name in scope){
            return scope[expr.name];
        }
        else{
            throw new ReferenceError(
                `Undefined binding: ${expr.name}`
            );
        }
    }
    else if(expr.type === "apply"){
        let {operator,args} = expr;
        if(operator.type === "word" &&  operator.name in specialForms){
            return specialForms[operator.name](expr.args,scope);
        }
        //normal function
        else{
            let op = evaluate(operator,scope);
            if(typeof op === "function"){
                return op(...args.map(arg => evaluate(arg,scope)));
            }
            else{
                throw new TypeError("Applying a non-function");
            }
        }
    }
}

const specialForms = Object.create(null);

//  cond ? a : b
specialForms.if = (args:Array<syntaxTree>,scope:Object) =>{
    if(args.length !== 3){
        throw new SyntaxError("Wrong number of args to if")
    }
    else if(evaluate(args[0],scope) !== false){
        return evaluate(args[1],scope);
    }
    else{
        return evaluate(args[2],scope);
    }
};

specialForms.while = (args:Array<syntaxTree>,scope:Object) =>{
    if(args.length !== 2){
        throw new SyntaxError("Wrong number of args to while");
    }
    while(evaluate(args[0],scope) !== false){
        evaluate(args[1],scope);
    }
    // Since undefined does not exist in Egg, we return false,
    // for lack of a meaningful result.
    return false;
};

//executes all its arguments from top to bottom
specialForms.do = (args:Array<syntaxTree>,scope:Object) =>{
    let value:boolean = false;
    for(let arg of args){
        value = evaluate(arg,scope);
    }
    return value;
};

specialForms.define = (args:Array<syntaxTree>,scope:Object) =>{
    if(args.length !== 2 || args[0].type !== "word"){
        throw new SyntaxError("Incorrect use of define");
    }
    let value = evaluate(args[1],scope);
    scope[args[0].name] = value;
    return value;
};

specialForms.set = (args:Array<syntaxTree>,scope:Object) =>{
    if(args.length !== 2 || args[0].type !== "word"){
        throw new SyntaxError("Incorrect use of set");
    }

    let outerScope = Object.getPrototypeOf(scope);
    let value = evaluate(args[1],scope);
    const name = args[0].name;

    while(outerScope !== null){
        if(Object.prototype.hasOwnProperty.call(outerScope,name)){
            outerScope[args[0].name] = value;
            return value;
        }
        else{
            outerScope = Object.getPrototypeOf(outerScope);
        }
    }
    throw new ReferenceError(`binding ${name} is undefined`);
};


specialForms.function = (args:Array<syntaxTree>,scope:Object) =>{
    if(!args.length){
        throw new SyntaxError("Function need a body");
    }
    let body:syntaxTree = args[args.length - 1];
    let params:Array<any> = args.slice(0,args.length-1).map(expr =>{
        if(expr.type != "word"){
            throw new SyntaxError("Parameter names must be words");
        }
        return expr.name;
    });

    return function () {
        if(arguments.length != params.length){
            throw new TypeError("Wrong number of arguments");
        }
        let localScope = Object.create(scope);
        for(let i = 0;i < arguments.length;i++){
            localScope[params[i]] = arguments[i];
        }
        return evaluate(body,localScope);
    }
};
