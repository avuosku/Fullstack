import axios from "axios";
let token = null;
const baseUrl = "/api/blogs";

const getAll = async () => {
  const response = await fetch(baseUrl);
  return await response.json();
};

const get = async (id) => {
  const response = await fetch(baseUrl+"/"+id);
  return await response.json();
};
const setToken = newToken => {
  if (!newToken) {
    console.error("Virhe: Token puuttuu!");
  }
  token = `Bearer ${newToken}`;
  localStorage.setItem("loggedBlogAppUser", JSON.stringify({ token: newToken }));
  console.log("Token asetettu:", token);
};

const create = async (newObject) => {
  /*const config = {
    headers: { Authorization: token },
  }*/
  const config = {
  headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("loggedBlogAppUser")).token}` },
  }
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};
/*
const create = async (newBlog) => {
  if (!token) {
    throw new Error("Token puuttuu! Kirjaudu uudelleen.");
  }

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token, 
    },
    body: JSON.stringify(newBlog),
  };

  const response = await fetch("http://localhost:3001/api/blogs", config);

  if (!response.ok) {
    throw new Error("Blogin luonti epäonnistui");
  }

  return await response.json();
};*/

const remove = async (id) => {
  /*
  const config = {
    headers: { Authorization: token },
  }
  */
  const config = {
    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("loggedBlogAppUser")).token}` },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};
/*
const remove = async (id) => {
  if (!token) {
    throw new Error("Token puuttuu! Kirjaudu uudelleen.");
  }

  const config = {
    method: "DELETE",
    headers: {
      "Authorization": token,
    },
  };

  const response = await fetch(`http://localhost:3001/api/blogs/${id}`, config);

  if (!response.ok) {
    throw new Error("Blogin poisto epäonnistui");
  }
};
*/

const update = async (id, updatedBlog) => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
  if (!loggedUserJSON) {
    throw new Error('Token puuttuu! Kirjaudu uudelleen.');
  }

  const user = JSON.parse(loggedUserJSON);
  const response = await fetch(`http://localhost:3001/api/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify(updatedBlog)
  });

  if (!response.ok) {
    throw new Error('Tykkäyksen päivitys epäonnistui');
  }

  return await response.json();
};

export default { getAll, get, create, remove, update, setToken };
