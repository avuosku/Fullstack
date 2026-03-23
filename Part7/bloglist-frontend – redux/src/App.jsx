import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Routes, Route, useParams } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';

// Services
import blogService from "./services/blogService";  // blogien käsittely
import loginService from "./services/login";       // kirjautumispalvelu, jos tarvitset suoraan

// Redux reducers (toimivat myös actionien lähteenä)
import { loginUser, logoutUser } from "./redux/reducers/userReducer";
import { initializeBlogs, updateBlog, markBlogAsDeletedAsync as deleteBlog, addCommentAsync as addComment } from "./redux/actions/blogActions"

import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Navbar from './components/Navbar'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'

const App = () => {
  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(loginUser(user))
      dispatch(initializeBlogs())
    }
  }, [dispatch])

  const handleLogout = async () => {
    dispatch(logoutUser())
    queryClient.clear()
    navigate('/')
  }

  const handleLike = (blog) => {
    const updated = { ...blog, likes: blog.likes + 1 }
    dispatch(updateBlog(updated))
  }

  const handleDelete = (blog) => {
    if (!blog) return
    const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!confirmDelete) return
    console.log('Deleting blog:', blog)
    dispatch(deleteBlog(blog.id))
  }

  const handleAddComment = (id, comment) => {
    dispatch(addComment(id, comment))
  }

  if (!user) {
    return (
      <div>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <div className="container">
      <Navbar user={user} handleLogout={handleLogout} />
      <Notification />

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>Blogs</h2>
              <BlogForm />
              <BlogList
                blogs={blogs}
                handleLike={handleLike}
                handleDelete={handleDelete}  
                handleAddComment={handleAddComment}
                user={user}
              />
            </div>
          }
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route
          path="/blogs/:id"
          element={
            <BlogWrapper
              handleLike={handleLike}
              handleDelete={handleDelete}  
              handleAddComment={handleAddComment}
            />
          }
        />
      </Routes>
    </div>
  )
}

const BlogWrapper = ({ handleLike, handleDelete, handleAddComment }) => {
  const { id } = useParams()
  const blog = useSelector((state) => state.blogs.find((b) => b._id === id))
  const user = useSelector((state) => state.user)

  if (!blog) return <div>Blog not found</div>

  return (
    <Blog
      blog={blog}
      handleLike={handleLike}
      handleDelete={handleDelete} 
      handleAddComment={handleAddComment}
      user={user}
    />
  )
}
export default App