import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons";

const getAll = () => {
  return axios.get(baseUrl)
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching persons:", error);
      throw error;
    });
};
  
  const create = (newObject) => {
    return axios.post(baseUrl, newObject).then(response => response.data);
  };

  const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data);
  };
  
  const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
  };
export default { getAll, create, update, remove };
