import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const vote = async (anecdote) => {
  const updated = {
    ...anecdote,
    votes: anecdote.votes + 1 // Tämä takaa yhden äänen lisäyksen
  }
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, updated)
  return response.data
}

const createNew = async (content) => {
  const newAnecdote = {
    content,
    votes: 0,
  }
  const response = await axios.post(baseUrl, newAnecdote)
  return response.data
}

export default { getAll, vote, createNew }
