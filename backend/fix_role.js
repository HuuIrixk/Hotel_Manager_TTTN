const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

async function fixRole() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    await sequelize.query("UPDATE users SET role = 'admin' WHERE username = 'admin'");
    console.log('Updated role to admin');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sequelize.close();
  }
}

fixRole();