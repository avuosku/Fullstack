// BlogForm.js
import React, { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

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
  );
};

export default BlogForm;
