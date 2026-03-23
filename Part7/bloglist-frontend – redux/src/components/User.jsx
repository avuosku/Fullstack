import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUsers } from '../redux/reducers/userListReducer'

const User = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  // Haetaan käyttäjät ja blogit Redux-storesta
  const users = useSelector(state => state.users)
  const allBlogs = useSelector(state => state.blogs)

  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(fetchUsers())
    }
  }, [dispatch, users])

  if (!users || users.length === 0 || !allBlogs || allBlogs.length === 0) {
    return <div>No blogs available</div>
  }

  console.log('ID from route:', id)
  console.log('Users in state:', users)
  console.log('All blogs in state:', allBlogs)

  // Etsitään käyttäjä ID:n perusteella
  const user = users.find(u => u._id === id)

  if (!user) {
    return <div>User not found</div>
  }

  // Tarkistetaan, että käyttäjän blogs sisältää oikeat blogi-ID:t
  console.log('User blogs:', user.blogs)

  // Yhdistetään käyttäjän blogit ja kaikki blogit
  const userBlogs = user.blogs
    .map(blogId => {
      const blog = allBlogs.find(blog => blog.id === blogId)
      return blog
    })
    .filter(blog => blog) // Suodatetaan pois mahdolliset undefinedit
    console.log('User blogs after mapping:', userBlogs)
    console.log('User blogs length:',userBlogs.length)
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {userBlogs.length > 0 ? (
          userBlogs.map(blog => (
            <li key={blog.id}>{blog.title}</li>
          ))
        ) : (
          <li>No blogs available</li>
        )}
      </ul>
    </div>
  )
}

export default User
