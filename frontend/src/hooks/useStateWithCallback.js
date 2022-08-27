import { useState, useRef, useEffect, useCallback } from 'react';
export const useStateWithCallback = (initialState) => {
    // const [clients, setClients]=useState([
    //     {
    //         id:1,
    //         name:'Harsh S'
    //     },
    //     {
    //         id:1,
    //         name:'john doe'
    //     }
    // ])
    const [state, setState] = useState(initialState);
    // const cbRef = useRef(null);
    const cbRef = useRef();


    // const updateState = useCallback((newState, cb) => {
    //     cbRef.current = cb;

    //     setState((prev) =>
    //         typeof newState === 'function' ? newState(prev) : newState
    //     );
    // }, [state]);
    const updateState = useCallback((newState, cb) => {
        cbRef.current = cb;

        setState((prev) =>{
           return typeof newState === 'function' ? newState(prev) : newState
    });
    },[]);


    useEffect(() => {
        if (cbRef.current) {
            cbRef.current(state);
            cbRef.current = null;
        
        }
    }, [state]);

    return [state, updateState];
};
