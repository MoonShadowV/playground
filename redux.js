const createStore = (reducer) =>{
    let state;
    const listeners = [];

    const getState = () => state;

    const dispatch = (action = {}) =>{
        state = reducer(state,action);
        listeners.forEach(listener => listener());
    };
    
    const subscribe = (listener) =>{
        listeners.push(listener);
        return () =>{
            listeners = listeners.filter(l => l !== listener)
        }
    };

    dispatch({type:"INIT"});//使每个reducer初始化state

    return { getState, dispatch, subscribe };
}


const combineReducers = (reducers) =>{
    return (state = {}, action) =>{
        let keys = Object.keys(reducers);
        return keys.reduce(
            (nextState,key) => {
                nextState[key] = reducers[key](state[key],action);
                return nextState;
            },{}
        )
    }
}

const combined = (state = {}, action) =>{
    return {
        filter: filter(state.filter,action),
        counter: counter(state.counter,action)
    }
}


const counter = (state = 0, action)=>{
    switch(action.type){
        case 'ADD': 
            return state+1;
        case 'MINUS': 
            return state-1;
        default:
            return state;
    }
}

const filter = (state = 0, action)=>{
    switch(action.type){
        case 'MOVE': 
            return state+1;
        case 'PRINT': 
            return state-1;
        default:
            return state;
    }
}



let reducers = combineReducers({counter,filter})

let store = createStore(reducers);