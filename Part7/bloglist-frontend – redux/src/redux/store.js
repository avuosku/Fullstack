import { createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'

import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import messageReducer from './reducers/messageReducer'
import userListReducer from './reducers/userListReducer' // ✅ lisätty tämä

const rootReducer = combineReducers({
  blogs: blogReducer,
  user: userReducer,
  users: userListReducer, // ✅ lisätty tämä
  message: messageReducer,
})

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store
