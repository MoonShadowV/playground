export class InputStream {
    private pos: number;
    private line: number;
    private col: number;
    private input: string;

    constructor(input: string) {
        this.pos = 0;
        this.line = 0;
        this.col = 0;
        this.input = input;
    }

    //returns the next value and also discards it from the stream.
    public next() {
        let ch = this.input.charAt(this.pos++);
        if (ch === "\n") {
            this.line++;
            this.col = 0;
        } else {
            this.col++;
        }
        return ch;
    }

    //returns the next value but without removing it from the stream.
    public peek() {
        return this.input.charAt(this.pos);
    }

    //returns true if and only if there are no more values in the stream.
    public eof() {
        return this.peek() === "";
    }

    public croak(msg: string) {
        throw new Error(`${msg} ( ${this.line} : ${this.col} )`);
    }
}