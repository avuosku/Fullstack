import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import blogService from '../services/blogService'
import { createBlogAsync } from '../redux/actions/blogActions'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (user && user.token) {
      blogService.setToken(user.token)
    }
  }, [user])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!user || !user.token) {
      console.error('Unauthorized attempt to create blog')
      return
    }

    try {
      const newBlog = { title, author, url }
      dispatch(createBlogAsync(newBlog)) // ✅ Lähetetään Reduxiin
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        Title: <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      </div>
      <div>
        Author: <input name="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
      </div>
      <div>
        URL: <input name="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
      </div>
      <button type="submit">Save</button>
    </form>
  )
}

export default BlogForm
