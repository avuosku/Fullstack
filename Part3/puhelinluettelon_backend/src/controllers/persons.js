import axios from 'axios';
const baseUrl = '/api/persons';  // Tämä toimii, kun backend ja frontend ovat samassa palvelussa

const getAll = () => axios.get(baseUrl).then(response => response.data);
const create = (newObject) => axios.post(baseUrl, newObject).then(response => response.data);
const remove = (id) => axios.delete(`${baseUrl}/${id}`);

export default { getAll, create, remove };