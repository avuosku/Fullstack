import axios from 'axios'

const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data.map(user => ({
    ...user,
    id: user._id // kopioi _id -> id
  }))
}

export default { getAll }

