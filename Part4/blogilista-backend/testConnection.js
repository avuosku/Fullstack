const mongoose = require('mongoose');

// MongoDB URI (esim. paikallinen tietokanta tai MongoDB Atlas -pilvipalvelu)
const uri = 'mongodb://localhost:27017/blogilista'; // Muuta tämä oman tietokannan URL:si mukaan

// Yhdistetään MongoDB:hen
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB-yhteys onnistui!');
    
    // Testaa lisäämällä yksinkertainen malli ja luomalla dokumentti
    const blogSchema = new mongoose.Schema({
      title: String,
      content: String
    });

    const Blog = mongoose.model('Blog', blogSchema);

    // Luo uusi blogikirjoitus
    const newBlog = new Blog({
      title: 'Testiblogi',
      content: 'Tämä on testiblogikirjoitus MongoDB:ssä!'
    });

    newBlog.save()
      .then(() => {
        console.log('Uusi blogikirjoitus tallennettu!');
        mongoose.connection.close(); // Sulje yhteys testin jälkeen
      })
      .catch((error) => {
        console.error('Virhe tallentaessa blogia:', error);
        mongoose.connection.close(); // Sulje yhteys virheen jälkeen
      });

  })
  .catch((error) => {
    console.error('Virhe yhdistettäessä MongoDB:hen:', error);
  });
