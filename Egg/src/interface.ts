export interface syntaxTree{
    type:string,
    value?:any,
    name?:any,
    operator?:syntaxTree,
    args?:Array<syntaxTree>,
}