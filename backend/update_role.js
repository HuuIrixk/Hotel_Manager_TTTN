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

async function updateRole() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // Thay 'your_username' bằng username thực tế của bạn
    const [result] = await sequelize.query(
      "UPDATE users SET role = 'admin' WHERE username = 'your_username_here' RETURNING *"
    );

    if (result.length > 0) {
      console.log('Updated user:', result[0]);
    } else {
      console.log('User not found. Check username.');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sequelize.close();
  }
}

updateRole();