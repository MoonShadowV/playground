import {syntaxTree} from './interface';

function parse(program:string){
    let {expr,rest} = parseExpression(program);
    if(skipSpace(rest).length > 0){
        throw new SyntaxError("Unexpected text after program");
    }
    return expr;
}

function parseExpression(program : string){
    program = skipSpace(program);
    let match:RegExpExecArray;
    let expr:syntaxTree;
    if (match = /^"([^"]*)"/.exec(program)) {//string
        expr = {type: "value", value: match[1]};
      } else if (match = /^\d+\b/.exec(program)) {//number
        expr = {type: "value", value: Number(match[0])};
      } else if (match = /^[^\s(),#"]+/.exec(program)) {//word
        expr = {type: "word", name: match[0]};
      } else {
        throw new SyntaxError("Unexpected syntax: " + program);
      }
      return parseApply(expr,program.slice(match[0].length));
}

function parseApply(expr:syntaxTree,program:string){
    program = skipSpace(program);

    if(program[0] != "("){
        return {expr:expr,rest:program};
    }
 
    program = skipSpace(program.slice(1));
    expr = {type:"apply",operator:expr,args:[]};
    while(program[0] != ")"){
        let arg = parseExpression(program);
        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);
        if(program[0] == ","){
            program = skipSpace(program.slice(1));
        }
        else if(program[0] != ")"){
            throw new SyntaxError("Expected ',' or ')'")
        }
    }
    return parseApply(expr,program.slice(1));
}

function skipSpace(string : string){
    let first = string.search(/\S/);
    if(first == -1){
        return "";
    }
    return string.slice(first);
}

export {parse};
