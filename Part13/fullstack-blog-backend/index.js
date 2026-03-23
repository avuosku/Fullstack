const app = require('./app');
const { sequelize } = require('./models');

const PORT = 3001;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync(); // jos käytät migraatioita, voi poistaa tämän rivin
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to DB:', error);
  }
};

start();
