import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { initializeBlogs } from '../redux/actions/blogActions';
import Blog from './Blog';

const BlogList = ({ handleLike, handleDelete, handleAddComment, user }) => {
  const dispatch = useDispatch();

  // Oletetaan, että reducer on nimetty "blogs" combineReducersissa
  const blogs = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  if (!blogs || blogs.length === 0) {
    return <p>No blogs available</p>;
  }

  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleDelete={handleDelete}
          handleAddComment={handleAddComment}
          user={user}
        />
      ))}
    </div>
  );
};

BlogList.propTypes = {
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleAddComment: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }),
};

export default BlogList;
