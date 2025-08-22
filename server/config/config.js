module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/guidance-counseling-app',
  JWT_SECRET: process.env.JWT_SECRET || 'a_very_strong_and_secret_jwt_key_for_dev',
};