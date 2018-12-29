const flattenArray = (array, depth = 1) =>{
    if(depth === 1){
        return array.reduce((pre,cur) => pre.concat(cur), []) 
    }
    return array.reduce((pre,cur) => pre.concat(Array.isArray(cur) ? flattenArray(cur, depth -1) : cur), []);
}

const logArray = (array) => {
    array.map((x) => console.log(x))
    return array;
}

logArray(flattenArray([1,[2,3],[4,[5,6,[7,8]]]]))

function New(){
    let temp = {};
    const f = [].shift.call(arguments);
    temp.__proto__ = f.prototype;
    f.apply(temp,arguments);
    return temp;
}
  
function createObj(obj){
    let temp = function(){};
    temp.prototype = obj;
    return new temp();
}

//寄生组合继承
function father(name){
    this.name = name;
}

function child(name,age){
    father.call(this,name);
    this.age = age;
}

child.prototype = Object.create(father.prototype);
child.constructor = child;

// extend(child,father);

// function extend(child,father){
//     let prototype = Object.create(father.prototype);
//     prototype.constructor = child;
//     child.prototype = prototype;
// }

function debounce(fn,delay){
    let timer;
    return function(){
        const callFn = () => fn.apply(this,arguments);
        if(timer){
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(callFn,delay);
    }
}

function throttle(fn,delay){
    let wait;
    return function(){
        if(!wait){
            wait = true;
            fn.apply(this,arguments);
            setTimeout(()=> wait=false,delay);
        }
    }
}

function importScrit(src){
    var script = document.createElement('script');
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
}

function people(name){
    this.name = name;
}

people.prototype.yell = ()=>console.log('yell');
people.prototype.goose = ()=>console.log('goose');

let pin = new people('tom');
let cin = Object.create(people);

for(let key in p){
    console.log(`key: ${key}, value: ${pin[key]}`);
}
console.log("+++++++++++++++++++++++")
for(let key in cin){
    console.log(`key: ${key}, value: ${cin[key]}`);
}


//Fib tree recursive 
function fib(n){
    if(n === 0){
        return 0;
    }
    else if(n === 1){
        return 1;
    }
    return fib(n-1)+fib(n-2);
}

//Fib linear recursive
function fib(n){
    fib_iter(1,0,n);
}

function fib_iter(a,b,count){
    if(count === 0){
        return b;
    }
    return fib_iter((a+b),a,count-1);
}

fib(3)

fib_iter(1,0,3);
fib_iter(1,1,2);
fib_iter(2,1,1);
fib_iter(3,2,0);// -> 2

//lisp pairs in js
function pairs(head,tail){
    return {
            car:()=>head,
            cdr:()=>tail
        }
}