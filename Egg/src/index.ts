import {run} from "./scope";

run(`
do(define(x, 4),
   define(setx, function(val, set(x, val))),
   setx(50),
   print(x))
`);

run(`set(quux, true)`);