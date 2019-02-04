import {evaluate} from "./evaluator";
import {parse} from "./parser";

const topScope  = Object.create(null);

topScope.true = true;
topScope.false = false;

const operators = [
    "+","-","*","/","==","<",">"
];

for(let op of operators){
    topScope[op] = Function("a,b",`return a ${op} b;`)
}

topScope.print = value =>{
    console.log(value);
    return value;
};

topScope.array = function () {
    return Array.from(arguments)
};

topScope.length = function (array:Array<any>) {
    return array.length;
};

topScope.element = function (array:Array<any>,n:number) {
    if(!Number.isInteger(n)){
        throw new SyntaxError(`${n} should be a number`);
    }
    else if(n > array.length - 1){
        throw new SyntaxError(`${n} is Out of index`);
    }
    else if(n < 0){
        throw new SyntaxError(`${n} should be positive`);
    }
    else if(!Array.isArray(array)){
        throw new SyntaxError(`${array} should be array`)
    }
    return array[n];
};

export function run(program:string){
    return evaluate(
        parse(program),
        Object.create(topScope)
    );
}