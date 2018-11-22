const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";


function nextTick(fn){
    setTimeout(fn,0);
}

function myPromise(fn){
    const self = this;
    self.status = PENDING;
    self.value = undefined;
    self.error = undefined;
    self.onResolvedCallbacks = [];
    self.onRejectedCallbacks = [];

    function resolve(value){
        if(self.status === PENDING){
            nextTick(()=>{
                self.status = RESOLVED;
                self.value = value;
                self.onResolvedCallbacks.forEach((callback) => callback(self.value));
            })
        }
    }

    function reject(error){
        if(self.status === PENDING){
            nextTick(()=>{
                self.status = REJECTED;
                self.error = error;
                self.onRejectedCallbacks.forEach((callback) => callback(self.error));
            })
        }
    }

    fn(resolve,reject);
}

myPromise.prototype.then = function(onResolved,onRejected){
    const self = this;
    let bridgePromise;

    //设置缺省值以便于容错
    onResolved = typeof onResolved === 'function' ? onResolved : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : error => {throw error};

    if (self.status === RESOLVED) {
        bridgePromise = new myPromise((resolve, reject) => {
            nextTick(() => {
                try {
                    let x = onResolved(self.value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        })
        return bridgePromise
    }
    if (self.status === REJECTED) {
        bridgePromise = new myPromise((resolve, reject) => {
            nextTick(() => {
                try {
                    let x = onRejected(self.error);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
        return bridgePromise
    }
    if (self.status === PENDING) {
        bridgePromise = new myPromise((resolve, reject) => {
            self.onResolvedCallbacks.push((value) => {
                try {
                    let x = onResolved(value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
            self.onRejectedCallbacks.push((error) => {
                try {
                    let x = onRejected(error);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
        return bridgePromise;
    }
}
//catch方法其实是个语法糖，就是只传onRejected不传onFulfilled的then方法
myPromise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
}

function resolvePromise(bridgePromise,x,resolve,reject){
    if(x && typeof x.then === 'function'){
        //如果x是一个promise
        if(x.status === PENDING){
            //持续解析结果，直到返回值不再是一个pending状态的promise
            x.then(
                value => resolvePromise(bridgePromise,value,resolve,reject),
                error => reject(error)
            )
        }else{
            x.then(resolve,reject)
        }
    }else{
        //如果x是一个普通值，则直接传递
        resolve(x);
    }
}


//test
// let fs = require("fs")
// let promise = new myPromise((resolve, reject) => {
//     fs.readFile('../file/1.txt', "utf8", function(err, data) {
//         err ? reject(err) : resolve(data)
//     });
// });
// let f1 = function(data) {
//     console.log(data)
//     return new myPromise((resolve, reject) => {
//         fs.readFile('../file/2.txt', "utf8", function(err, data) {
//             err ? reject(err) : resolve(data)
//         });
//     });
// }
// let f2 = function(data) {
//     console.log(data)
//     return new myPromise((resolve, reject) => {
//         fs.readFile('../file/3.txt', "utf8", function(err, data) {
//             err ? reject(err) : resolve(data)
//         });
//     });
// }
// let f3 = function(data) {
//     console.log(data);
// }
// let errorLog = function(error) {
//     console.log(error)
// }
// promise.then(f1).then(f2).then(f3).catch(errorLog)




// function promise(fn){
//     let state = PENDING;
//     let value;//缓存结果值
//     let deferred;// 用于缓存handler

//     function resolve(newValue){
//         //如果传入的是一个promise,那么自动将其resolve,把value暴露出来
//         try {
//             if(newValue && typeof newValue.then === 'function'){
//                 newValue.then(resolve);
//                 return;
//             }
//             value = newValue;
//             state = RESOLVED;
    
//             if(deferred){
//                 handle(deferred);
//             }
//         } catch (error) {
//             reject(error);
//         }
//     }
    
//     function reject(error){
//         state = REJECTED;
//         value = error;

//         if(deferred){
//             handle(deferred);
//         }
//     }
    
//     function handle(handler){
//         //pending状态就先将handler缓存在deferred中，以便于后续调用
//         if(state === PENDING){
//             deferred = handler;
//             return;
//         }

//         //根据状态来判断使用哪种回调函数
//         let handlerCallback = state === RESOLVED ? handler.onResolved 
//                                                  : handler.onRejected;
//         //没有传回调函数，直接根据状态处理吧
//         if(!handlerCallback){
//             state === RESOLVED ? handler.resolve(value)
//                                : handler.reject(value);
//             return;
//         }

//         let res;
//         try {
//             res = handlerCallback(value);
//         } catch (error) {
//             handler.reject(error);
//             return;
//         }

//         handler.resolve(res);
//     }

//     //onResolved resolved回调函数
//     //onRejected rejected回调函数
//     this.then = function(onResolved,onRejected){
//         return new promise(function(resolve,reject){
//             let handler = {
//                 onResolved:onResolved,
//                 onRejected:onRejected,
//                 resolve:resolve,
//                 reject:reject
//             }
//             handle(handler);
//         })
//     }

//     fn(resolve,reject);
// }