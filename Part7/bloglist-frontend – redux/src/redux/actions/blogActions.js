// blogActions.js
import blogService from '../../services/blogService'

// Action-tyypit
export const FETCH_BLOGS = 'FETCH_BLOGS'
export const ADD_BLOG = 'ADD_BLOG'
export const REMOVE_BLOG = 'REMOVE_BLOG'
export const SET_BLOGS = 'SET_BLOGS'
export const UPDATE_BLOG = 'UPDATE_BLOG'
export const ADD_COMMENT = 'ADD_COMMENT'

// Lataa blogit
export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: FETCH_BLOGS,
      payload: blogs
    })
  }
}

// Lisää blogi
export const addBlog = (blog) => {
  return {
    type: ADD_BLOG,
    payload: blog
  }
}

// Poista blogi (soft delete)
export const markBlogAsDeletedAsync = (id) => {
  return async (dispatch) => {
    try {
      console.log('Deleting blog with id:', id);
      await blogService.remove(id) // käytetään remove, ei markAsDeleted
      dispatch({
        type: 'REMOVE_BLOG',
        payload: id,
      })
    } catch (error) {
      console.error('Failed to delete blog', error)
    }
  }
}

// Päivitä blogi
export const updateBlog = (blog) => {
  return async (dispatch) => {
    const updated = await blogService.update(blog.id || blog._id, blog)
    dispatch({
      type: UPDATE_BLOG,
      payload: updated
    })
  }
}

// Lisää kommentti
export const addCommentAsync = (id, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.addComment(id, comment)
    dispatch({
      type: UPDATE_BLOG,
      payload: updatedBlog
    })
  }
}

export const createBlogAsync = (blog) => {
  return async (dispatch) => {
    const created = await blogService.create(blog)
    dispatch({
      type: ADD_BLOG,
      payload: created
    })
  }
}