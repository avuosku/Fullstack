import axios from 'axios';

//const baseUrl = 'http://localhost:3001/api/login';
const baseUrl = '/api/login';

const login = async (credentials) => {
  //try {
    const response = await axios.post(baseUrl, credentials);
    /*, {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );*/
    return response.data;
  /*} catch (error) {
    if (error.response) {
      // Virheenkäsittely, jos palvelin palauttaa virheilmoituksen
      //console.error('Error response:', error.response.data);
      return { error: error.response.data };  // Palautetaan virheilmoitus
    } else if (error.request) {
      // Ei vastausta
      console.error('Error request:', error.request);
      return { error: 'No response from the server' };
    } else {
      // Tuntematon virhe
      console.error('Error message:', error.message);
      return { error: error.message };
    }
  }*/
};

export default { login };
