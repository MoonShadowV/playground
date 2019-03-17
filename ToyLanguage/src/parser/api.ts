import {ASSIGN, BINARY, BOOLEAN, CALL, IF, LAMBDA, LET, NUMBER, PROG, STRING, VAR} from "./constans";


export class ASTNode {
    type: string;
    constructor(type: string) {
        this.type = type;
    }
}

export class NumberNode extends ASTNode {

    value: number;

    constructor(value: number) {
        super(NUMBER);
        this.type = NUMBER;
        this.value = value;
    }
}

export class StringNode extends ASTNode {
    value: string;

    constructor(value: string) {
        super(STRING);
        this.type = STRING;
        this.value = value;
    }
}

export class BooleanNode extends ASTNode {
    value: boolean;

    constructor(value: boolean) {
        super(BOOLEAN);
        this.value = value;
    }
}

export class VarNode extends ASTNode {
    value: string;

    constructor(value: string) {
        super(VAR);
        this.value = value;
    }
}

export class LambdaNode extends ASTNode {
    vars: Array<string>;
    body: ASTNode;

    constructor(vars: Array<string>, body: ASTNode) {
        super(LAMBDA);
        this.vars = vars;
        this.body = body;
    }
}

export class CallNode extends ASTNode {
    func: ASTNode;
    args: Array<ASTNode>;

    constructor(func: ASTNode, args: Array<ASTNode>) {
        super(CALL);
        this.func = func;
        this.args = args;
    }
}

export class IfNode extends ASTNode {
    cond: ASTNode;
    then: ASTNode;
    or?: ASTNode;

    constructor(cond: ASTNode, then: ASTNode, or?: ASTNode) {
        super(IF);
        this.cond = cond;
        this.then = then;
        this.or = or;
    }


}

export class AssignNode extends ASTNode {
    operator: string;
    left: ASTNode;
    right: ASTNode;

    constructor(left: ASTNode, right: ASTNode) {
        super(ASSIGN);
        this.operator = "=";
        this.left = left;
        this.right = right;
    }
}

export class BinaryNode extends ASTNode {
    operator: string;
    left: ASTNode;
    right: ASTNode;

    constructor(operator: string, left: ASTNode, right: ASTNode) {
        super(BINARY);
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}

export class ProgNode extends ASTNode {
    prog: Array<ASTNode>;

    constructor(prog: Array<ASTNode>) {
        super(PROG);
        this.prog = prog;
    }
}

export class LetNode extends ASTNode {
    vars: Array<ASTNode>;
    body: ASTNode;

    constructor(vars: Array<ASTNode>, body: ASTNode) {
        super(LET);
        this.vars = vars;
        this.body = body;
    }
}
