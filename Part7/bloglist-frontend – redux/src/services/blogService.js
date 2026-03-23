import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const formatBlog = (blog) => ({
  ...blog
})

const getAll = async () => {
  const response = await axios.get(baseUrl);
  console.log('Response:', response);
  
  const formatted = response.data.map(formatBlog);
  console.log('Fetched blogs:', formatted);
  return formatted;
}

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return formatBlog(response.data)
}

const create = async (newBlog) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(baseUrl, newBlog, config)
  return formatBlog(response.data)
}

const update = async (id, updatedBlog) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return formatBlog(response.data)
}

const remove = async (id) => {
  const config = { headers: { Authorization: token } }
  await axios.delete(`${baseUrl}/${id}`, config)
  return id
}

const addComment = async (id, comment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment })
  return formatBlog(response.data)
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  addComment,
  setToken,
}
