import { FETCH_BLOGS, ADD_BLOG, REMOVE_BLOG, SET_BLOGS, UPDATE_BLOG } from '../actions/blogActions'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_BLOGS:
      return action.payload.filter(blog => !blog.isDeleted)

    case ADD_BLOG:
      return [...state, action.payload]

    case REMOVE_BLOG:
      return state.filter(blog => blog.id !== action.payload)

    case SET_BLOGS:
      return action.payload

    case UPDATE_BLOG:
      return state.map(blog =>
        blog.id === action.payload.id ? action.payload : blog
      )

    default:
      return state
  }
}

export default blogReducer
