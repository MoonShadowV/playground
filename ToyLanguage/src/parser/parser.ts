import {AssignNode, ASTNode, BinaryNode, BooleanNode, CallNode, IfNode, LambdaNode, ProgNode} from "./api";
import {Token, TokenStream} from "./lexer";
import {KEYWORD, OPERATOR, PUNCTUATION, VAR} from "./constans";

const FALSE = new BooleanNode(false);

export class Parser {
    input: TokenStream;

    constructor(input: TokenStream) {
        this.input = input;
    }

    static readonly PRECEDENCE = {
        "=": 1,
        "||": 2,
        "&&": 3,
        "<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
        "+": 10, "-": 10,
        "*": 20, "/": 20, "%": 20,
    };

    parse() {
        return this.parseToplevel();
    }


    isPunctuation(ch?: string) {
        const token: Token = this.input.peek();
        return token && token.type === PUNCTUATION && (!ch || token.value === ch) && token;
    };

    isKeyword(keyword?: string) {
        const token: Token = this.input.peek();
        return token && token.type === KEYWORD && (!keyword || token.value === keyword) && token;
    };

    isOperator(op?: string) {
        const token: Token = this.input.peek();
        return token && token.type === OPERATOR && (!op || token.value === op) && token;
    };

    skipPunctuation(ch: string) {
        if (this.isPunctuation(ch)) {
            this.input.next();
        } else {
            this.input.croak(`Expecting punctuation:[   ${ch}   ]`);
        }
    };

    skipKeyword(keyword: string): void {
        if (this.isKeyword(keyword)) {
            this.input.next();
        } else {
            this.input.croak(`Expecting keyword:[   ${keyword}   ]`);
        }
    };

    skipOperator(op: string) {
        if (this.isOperator(op)) {
            this.input.next();
        } else {
            this.input.croak(`Expecting operator:[   ${op}   ]`);
        }
    };

    unexpected() {
        this.input.croak(`Unexpected token:[    ${JSON.stringify(this.input.peek())}    ]`);
    };

    maybeBinary(left: ASTNode, myPrec = 0) {
        const token = this.isOperator();
        if (token) {
            const hisPrec = Parser.PRECEDENCE[token.value];
            if (hisPrec > myPrec) {
                this.input.next();
                let Node =
                    token.value === "=" ?
                        new AssignNode(left, this.maybeBinary(this.parseAtom(), hisPrec))
                        :
                        new BinaryNode(token.value, left, this.maybeBinary(this.parseAtom(), hisPrec));

                return this.maybeBinary(Node, myPrec);
            }
        }
        return left;
    };

    maybeCall(expr: Function) {
        const res: ASTNode = expr();
        return this.isPunctuation("(") ? this.parseCall(res) : res;
    };

    delimited(start: string, stop: string, separator: string, parser: Function) {
        const a = [];
        let first = true;
        this.skipPunctuation(start);
        while (!this.input.eof()) {
            if (this.isPunctuation(stop)) {
                break;
            }

            if (first) {
                first = false;
            } else {
                this.skipPunctuation(separator);
            }

            if (this.isPunctuation(stop)) {
                break;
            }

            a.push(parser());
        }
        this.skipPunctuation(stop);
        return a;
    }

    parseCall(func: ASTNode) {
        return new CallNode(
            func,
            this.delimited("(", ")", ",",
                this.parseExpression));
    }

    parseVarname() {
        const name = this.input.next();
        if (name.type !== VAR) {
            this.input.croak("Expecting variable name");
        }
        return name.value;
    }

    parseIf() {
        this.skipKeyword("if");
        const cond = this.parseExpression();

        if (!this.isPunctuation("{")) {
            this.skipKeyword("then");
        }
        const then = this.parseExpression();
        const ret = new IfNode(cond, then);

        if (this.isKeyword("else")) {
            this.input.next();
            ret.or = this.parseExpression();
        }

        return ret;
    }

    parseLambda() {
        return new LambdaNode(
            this.delimited("(", ")", ",", this.parseVarname),
            this.parseExpression()
        )
    }

    parseBool() {
        return new BooleanNode(this.input.next().value === "true");
    }

    parseToplevel() {
        const prog: Array<ASTNode> = [];
        while (!this.input.eof()) {
            prog.push(this.parseExpression());
            if (!this.input.eof()) {
                this.skipPunctuation(";");
            }
        }
        return new ProgNode(prog);
    }

    parseProg() {
        const prog = this.delimited("{", "}", ";", this.parseExpression);
        if (prog.length === 0) {
            return FALSE;
        } else if (prog.length === 1) {
            return prog[0];
        }
        return new ProgNode(prog);
    }

    parseAtom() {
        return this.maybeCall(() => {
            if (this.isPunctuation("(")) {
                this.input.next();
                const exp = this.parseExpression();
                this.skipPunctuation(")");
                return exp;
            }

            if (this.isPunctuation("{")) {
                return this.parseProg();
            }
            if (this.isKeyword("if")) {
                return this.parseIf();
            }
            if (this.isKeyword("true")
                || this.isKeyword("false")) {
                return this.parseBool();
            }
            if (this.isKeyword("lambda")
                || this.isKeyword("function")) {
                this.input.next();
                return this.parseLambda();
            }

            const token = this.input.next();
            const list = new Set(["var", "number", "string"]);
            if (list.has(token.type)) {
                return token;
            }
            this.unexpected();
        })
    }


    parseExpression(): ASTNode {
        return this.maybeCall(() => {
            return this.maybeBinary(this.parseAtom(), 0);
        })
    }


}