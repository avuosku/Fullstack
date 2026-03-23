import blogService from '../../services/blogService'

export const SET_COMMENTS = 'SET_COMMENTS'
export const ADD_COMMENT = 'ADD_COMMENT'

export const setComments = (blogId, comments) => ({
  type: SET_COMMENTS,
  payload: { blogId, comments },
})

export const addCommentAction = (blogId, comment) => ({
  type: ADD_COMMENT,
  payload: { blogId, comment },
})

// Async
export const initializeComments = (blogId) => {
  return async (dispatch) => {
    const blog = await blogService.getById(blogId)
    dispatch(setComments(blog.id, blog.comments))
  }
}

export const addCommentAsync = (blogId, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.addComment(blogId, comment)
    dispatch(addCommentAction(blogId, comment))
  }
}
