import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../redux/reducers/userReducer' // käytetään loginUseria
import { setNotification } from '../redux/reducers/notificationReducer'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      // Käytetään loginUseria, ei setUseria
      dispatch(loginUser({ username, password }))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('Wrong credentials', 'error', 5))
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm
