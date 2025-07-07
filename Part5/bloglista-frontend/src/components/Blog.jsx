import React, { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  if (!blog) return null;

  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const showRemoveButton = user && blog.user.username === user.username;

  return (
    <div style={{ border: "1px solid black", padding: "10px", marginBottom: "10px" }}>
      <div>
        <h2>{blog.title} by {blog.author}</h2>
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>

      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            {blog.likes} likes 
            <button onClick={() => handleLike(blog)} aria-label="Like">Like</button>
          </p>
          {showRemoveButton && (
            <button style={{ color: "red" }} onClick={() => handleDelete(blog)}>
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }),
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }),
};

export default Blog;
