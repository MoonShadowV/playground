function createEventObj() {
    let subscribers = {};

    let on = function(sub, func){
        if (!subscribers[sub]) {
            subscribers[sub] = []
        }
        subscribers[sub].push(func);
    }


    let emit = function(){
        const sub = Array.prototype.shift.call(arguments);
        const funcList = subscribers[sub];
        if (!funcList || funcList.length === 0) {
            return false;
        }
        funcList.forEach(func => {
            func.apply(this, arguments);
        });
    }

    let remove = function(sub, func){
        let funcList = subscribers[sub];
        if (!funcList || funcList.length === 0) {
            return false;
        }
        if (!func) {
            funcList && (funcList.length = 0);
        } else {
            subscribers[sub] = funcList.filter((f) => f !== func);
        }
    }

    let look = function(){
        return subscribers;
    }

    return {
        on,
        emit,
        remove,
        look
    }
}