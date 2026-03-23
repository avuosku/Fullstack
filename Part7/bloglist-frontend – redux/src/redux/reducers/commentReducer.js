import { SET_COMMENTS, ADD_COMMENT } from '../actions/commentActions'

const commentReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_COMMENTS:
      return {
        ...state,
        [action.payload.blogId]: action.payload.comments,
      }

    case ADD_COMMENT:
      return {
        ...state,
        [action.payload.blogId]: [
          ...(state[action.payload.blogId] || []),
          action.payload.comment,
        ],
      }

    default:
      return state
  }
}

export default commentReducer
