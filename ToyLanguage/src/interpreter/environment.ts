class Environment{
    vars:Object;
    parent:Environment;

    constructor(parent:Environment) {
        this.vars = Object.create(parent ? parent.vars : null);
        this.parent = parent;
    }

    //创建次级作用域
    extend(){
        return new Environment(this);
    }

    lookup(name:string){
        let scope:Environment = this;
        while(scope){
            if(Object.prototype.hasOwnProperty.call(scope.vars,name)){
                return scope;
            }
            scope = scope.parent;
        }
    }
    get(name:string){
        if(name in this.vars){
            return this.vars[name];
        }
        throw new Error(`Undefined variable ${name}`);
    }
    //在局部作用域内赋值
    set(name:string,value){
        const scope:Environment = this.lookup(name);
        //不允许在局部作用域对全局变量赋值
        if(!scope && this.parent){
            throw new Error(`Undefined variable ${name}`);
        }
        return (scope || this).vars[name] = value;
    }
    //在当前作用域定义一个局部变量。这个变量会遮盖上级作用域内的同名变量
    define(name:string,value){
        return this.vars[name] = value;
    }

}