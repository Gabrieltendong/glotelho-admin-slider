const initialState = {user: ''}

const userReducer = (state = initialState, action) => {
    let nextState;
    switch(action.type){
        case 'SET_USER':
            nextState = {
                ...state,
                user: action.value
            }
            return nextState;
        default:
            return state
    }
}

export default userReducer