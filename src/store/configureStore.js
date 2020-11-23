import { createStore, combineReducers } from 'redux'
import userReducer from './Reducers/userReducer'

const rootReducer = combineReducers({
    userReducer
})

export const store = createStore(rootReducer)


