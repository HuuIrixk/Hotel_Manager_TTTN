require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres', // Không cần username/pass vì dùng URL
    password: null,
    database: 'postgres',
    host: 'aws-1-ap-southeast-1.pooler.supabase.com',
    port: 6543,
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    username: 'postgres',
    password: null,
    database: 'postgres',
    host: 'aws-1-ap-southeast-1.pooler.supabase.com',
    port: 6543,
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};