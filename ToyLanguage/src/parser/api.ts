class Token {
    type:string

    constructor(type: string) {
        this.type = type;
    }
}

export class NumberToken extends Token{
    value:number;

    constructor(value: number) {
        super("number");
        this.value = value;
    }
}

export class StringToken extends Token{
    value:string;

    constructor(value: string) {
        super("string");
        this.value = value;
    }
}

export class BooleanToken extends Token{
    value:boolean;

    constructor(value: boolean) {
        super("bool");
        this.value = value;
    }
}

export class VarToken extends Token{
    value:string;

    constructor(value: string) {
        super("var");
        this.value = value;
    }
}

export class LambdaToken extends Token{
    vars:Array<string>;
    body:Token;

    constructor(vars: Array<string>, body: Token) {
        super("lambda");
        this.vars = vars;
        this.body = body;
    }
}

export class CallToken extends Token{
    func:Token;
    args:Array<Token>

    constructor(func: Token, args: Array<Token>) {
        super("call");
        this.func = func;
        this.args = args;
    }
}

export class IfToken extends Token{
    cond:Token;
    then:Token;
    or:Token;

    constructor(cond: Token, then: Token, or: Token) {
        super("if");
        this.cond = cond;
        this.then = then;
        this.or = or;
    }


}

export class AssignToken extends Token{
    operator:string;
    left:Token;
    right:Token;

    constructor(left: Token, right: Token) {
        super("assign");
        this.operator = "=";
        this.left = left;
        this.right = right;
    }
}

export class BinaryToken extends Token{
    operator:string;
    left:Token;
    right:Token;

    constructor(operator: string, left: Token, right: Token) {
        super("binary");
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}

export class ProgToken extends Token{
    prog:Array<Token>;

    constructor(prog: Array<Token>) {
        super("prog");
        this.prog = prog;
    }
}

export class LetToken extends Token{
    vars:Array<Token>;
    body:Token;

    constructor(vars: Array<Token>, body: Token) {
        super("let");
        this.vars = vars;
        this.body = body;
    }
}
