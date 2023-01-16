
export let initialState =  JSON.parse(localStorage.getItem("User")); 
 
export const reducer = (state, action) =>{
    if(action.type === "USER"){
        return [action.payload,
        localStorage.setItem("User", JSON.stringify(action.payload))]

    }

    return state; 
    
}
