import {InputStream} from "./InputStream";


export class TokenStream {
    private current: Token;
    private input: InputStream;


    static keywords: string = "if then else function true false";
    static Operators: Set<string> = new Set([
        "+", "-", "*", "/", "%", "=", "&", "|", "<", ">", "!"
    ]);
    static Punctuation: Set<string> = new Set([
        ",", ";", "(", ")", "{", "}", "[", "]"
    ]);

    constructor(input: InputStream) {
        this.current = null;
        this.input = input;
    }

    static isKeyWord(x) {
        return TokenStream.keywords.indexOf(" " + x + " ") >= 0;
    }

    static isDigit(ch: string) {
        return /[0-9]/i.test(ch);
    }

    static isIdStart(ch: string) {
        return /[a-z_]/i.test(ch);
    }

    static isId(ch: string) {
        return TokenStream.isIdStart(ch);
    }

    static isOpChar(ch: string) {
        return TokenStream.Operators.has(ch);
    }

    static isPunctuation(ch: string) {
        return TokenStream.Punctuation.has(ch);
    }

    static isWhiteSpace(ch: string) {
        return ' \n'.indexOf(ch) >= 0;
    }

    private readWhile(predicate: Function) {
        let str: string = "";
        while (!this.input.eof() && predicate(this.input.peek())) {
            str += this.input.next();
        }
        return str;
    }

    private readNumber() {
        let hasDot: boolean = false;
        let number = this.readWhile((ch: string) => {
            if (ch === ".") {
                if (hasDot) {
                    return false;
                }
                hasDot = true;
                return true;
            }
            return TokenStream.isDigit(ch);
        });
        return new Token("number", parseFloat(number));
    }

    private readIdent() {
        const id = this.readWhile(TokenStream.isId);
        const type = TokenStream.isKeyWord(id) ? "keyword" : "var";
        return new Token(type, id);
    }

    private readEscape(end: string) {
        let escaped: boolean = false, str: string = "";
        this.input.next();//去除重叠的""
        while (!this.input.eof()) {
            let ch: string = this.input.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch === `\\`) {
                escaped = true;
            } else if (ch === end) {
                break;
            } else {
                str += ch;
            }
        }
        return str;
    }

    private readString() {
        const value = this.readEscape(`"`);
        return new Token("string", value);
    }

    private skipComment() {
        this.readWhile((ch: string) => ch !== `\n`);
        this.input.next();
    }

    private readNext(): Token {
        this.readWhile(TokenStream.isWhiteSpace);

        if (this.input.eof()) {
            return null;
        }

        const ch: string = this.input.peek();

        if (ch === "#") {
            this.skipComment();
            return this.readNext();
        }
        if (ch === `"`) {
            return this.readString();
        }
        if (TokenStream.isDigit(ch)) {
            return this.readNumber();
        }
        if (TokenStream.isIdStart(ch)) {
            return this.readIdent();
        }
        if (TokenStream.isPunctuation(ch)) {
            const value = this.input.next();
            return new Token("punctuation", value);
        }
        if (TokenStream.isOpChar(ch)) {
            const value = this.readWhile(TokenStream.isOpChar);
            return new Token("operator", value);
        }

        this.input.croak(`Can't handle character ${ch}`);
    }

    peek() {
        return this.current || (this.current = this.readNext());
    }

    next() {
        let token = this.current;
        this.current = null;
        return token || this.readNext();
    }

    eof() {
        return this.peek() === null;
    }

    croak(msg: string) {
        this.input.croak(msg);
    }
}

export class Token {
    type: string;
    value: any;

    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}