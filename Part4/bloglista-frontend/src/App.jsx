import React, { useState, useEffect } from 'react';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import blogService from './services/blogService';

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showForm, setShowForm] = useState(false); // ✅ Uusi tila lomakkeen näyttämiseen

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []); 

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      const blogs = await blogService.getAll();
      setBlogs(blogs);
      setSuccessMessage(`A new blog "${newBlog.title}" added!`);
      setTimeout(() => setSuccessMessage(null), 5000);
      setShowForm(false); // ✅ Piilota lomake onnistuneen lisäyksen jälkeen
    } catch (exception) {
      setErrorMessage('Error creating blog');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };

  const handleLike = async (blog) => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 };
      await blogService.update(blog.id, updatedBlog);
      setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)));
    } catch (exception) {
      setErrorMessage('Error liking blog');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleDelete = async (blog) => {
    if (!user || blog.user.username !== user.username) {
      alert("You can only delete your own blogs!");
      return;
    }
  
    if (window.confirm(`Remove blog "${blog.title}"?`)) {
      try {
        await blogService.remove(blog.id); // Poistetaan blogi palvelimelta
        setBlogs(blogs.filter((b) => b.id !== blog.id)); // Suodatetaan vain kyseinen blogi pois
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  return (
    <div>
      {successMessage && (
        <p style={{ color: 'green', fontWeight: 'bold', border: '1px solid green', padding: '5px' }}>
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p style={{ color: 'red', fontWeight: 'bold', border: '1px solid red', padding: '5px' }}>
          {errorMessage}
        </p>
      )}

      <h1>Blogs</h1>
      {user === null ? (
        <LoginForm setUser={setUser} setErrorMessage={setErrorMessage} />
      ) : (
        <>
          <p>
            Welcome {user.username}{' '}
            <button onClick={handleLogout}>Logout</button>
          </p>

          {/* ✅ Nappi lomakkeen näyttämiseen/piilottamiseen */}
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Blog'}
          </button>

          {/* ✅ Lomake näkyy vain jos showForm on true */}
          {showForm && <BlogForm createBlog={createBlog} />}

          <BlogList blogs={blogs} handleLike={handleLike} handleDelete={handleDelete} user={user} />
        </>
      )}
    </div>
  );
};

export default App;
