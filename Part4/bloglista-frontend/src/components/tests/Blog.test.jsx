import React from 'react';
import { fireEvent, render, screen } from "@testing-library/react";
import Blog from '../Blog';
import BlogForm from '../BlogForm';

test('show only blog header and author, but not URL or likes', () => {
    const blog = {
        title: 'Test blog',
        author: 'Tester',
        url: 'http://test.com',
        likes: 10,
    };

    render(<Blog blog={blog} />);

    // Tarkista otsikko ja tekijä
    expect(screen.getByRole('heading', { name: /Test blog/i })).toBeDefined();
    expect(screen.getByText(/by/i)).toBeDefined();
    expect(screen.getByText(/Tester/i)).toBeDefined();

    // Tarkista, että URL ja tykkäykset eivät ole näkyvissä
    expect(screen.queryByText('http://test.com')).toBeNull();
    expect(screen.queryByText(/likes/i)).toBeNull();
});

test('show URL and likes when "view" is clicked', () => {
    const blog = {
        title: 'Test blog',
        author: 'Tester',
        url: 'http://test.com',
        likes: 10,
    };

    render(<Blog blog={blog} />);

    const button = screen.getByText('view');
    fireEvent.click(button);

    // Tarkista, että URL ja tykkäykset näkyvät
    expect(screen.getByText('http://test.com')).toBeDefined();
    expect(screen.getByText(/likes/i)).toBeDefined();
});

test("like button is clicked twice", () => {
  const mockHandler = jest.fn();
  const blog = {
    title: "Test blog",
    author: "Tester",
    url: "http://test.com",
    likes: 0,
    user: { username: "Tester" },
  };

  render(<Blog blog={blog} handleLike={mockHandler} handleDelete={jest.fn()} user={{ username: "Tester" }} />);

  // Klikkaa "view" nappia, jotta yksityiskohdat tulevat näkyviin
  fireEvent.click(screen.getByText("view"));

  // Napsauta "Like"-nappia kahdesti
  const likeButton = screen.getByRole("button", { name: /Like/i });
  fireEvent.click(likeButton);
  fireEvent.click(likeButton);

  // Varmista, että mockHandler on kutsuttu kahdesti
  expect(mockHandler).toHaveBeenCalledTimes(2);
});


  test('blog form calls the function with right information', () => {
    const createBlog = jest.fn();
  
    render(<BlogForm createBlog={createBlog} />);
  
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'New blog' },
    });
    fireEvent.change(screen.getByPlaceholderText('Author'), {
      target: { value: 'Author' },
    });
    fireEvent.change(screen.getByPlaceholderText('URL'), {
      target: { value: 'http://new.com' },
    });
  
    fireEvent.submit(screen.getByText(/save/i));
  
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'New blog',
      author: 'Author',
      url: 'http://new.com',
    });
  });
