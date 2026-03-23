import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addComment } from '../redux/reducers/blogReducer'

const BlogPage = () => {
  const { id } = useParams()
  const blog = useSelector(state => state.blogs.find(b => b.id === id))
  const dispatch = useDispatch()

  if (!blog) return null

  const handleComment = (e) => {
    e.preventDefault()
    const comment = e.target.comment.value
    e.target.comment.value = ''
    dispatch(addComment(blog.id, comment))
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.url}</p>
      <p>{blog.likes} likes</p>
      <p>added by {blog.user.name}</p>

      <h3>Comments</h3>
      <form onSubmit={handleComment}>
        <input name="comment" />
        <button type="submit">add comment</button>
      </form>

      <ul>
        {blog.comments && blog.comments.length > 0 ? (
          blog.comments.map((c, i) => <li key={i}>{c}</li>)
        ) : (
          <li>No comments yet.</li>
        )}
      </ul>
    </div>
  )
}

export default BlogPage
