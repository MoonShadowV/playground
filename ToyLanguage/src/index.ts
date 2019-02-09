import {InputStream} from "./parser/InputStream";
import {TokenStream} from "./parser/lexer";

const a:InputStream = new InputStream("THIS IS A INPUT");
const b:TokenStream = new TokenStream(a);
console.log(b.readNext());
