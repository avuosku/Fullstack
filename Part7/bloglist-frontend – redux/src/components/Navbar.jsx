import { Link } from 'react-router-dom'

const Navbar = ({ user, handleLogout }) => {
  return (
    <div style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
      <Link to="/" style={{ padding: 5 }}>blogs</Link>
      <Link to="/users" style={{ padding: 5 }}>users</Link>
      <span style={{ padding: 5 }}>{user.username} logged in</span>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Navbar
