import React, { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const Blog = ({ blog: initialBlog, handleLike, handleDelete, handleAddComment, user }) => {
  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState("");

  // 🔁 Hae blogi aina uudelleen Redux-storesta ID:n perusteella
  const blog = useSelector((state) =>
    state.blogs.find((b) => b.id === initialBlog.id)
  );

  if (!blog) return null;

  const toggleVisibility = () => setVisible(!visible);

  const showRemoveButton = user && blog.user?.username === user.username;

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (comment.trim() !== "") {
      handleAddComment(blog.id, comment);
      setComment(""); // Tyhjennä kenttä
    }
  };

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
            {blog.likes} likes{" "}
            <button onClick={() => handleLike(blog)} aria-label="Like">Like</button>
          </p>
          {showRemoveButton && (
            <button style={{ color: "red" }} onClick={() => handleDelete(blog)}>
              Remove
            </button>
          )}

          <div style={{ marginTop: "1rem" }}>
            <h4>Comments</h4>
            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
              />
              <button type="submit">Add comment</button>
            </form>
            <ul>
              {blog.comments && blog.comments.map((c, index) => (
                <li key={index}>{c}</li>
              ))}
            </ul>
          </div>
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
      id: PropTypes.string,
      username: PropTypes.string,
    }),
    comments: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleAddComment: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,       // ei enää required
    username: PropTypes.string, // ei enää required
    token: PropTypes.string,
  }),
};

export default Blog;
