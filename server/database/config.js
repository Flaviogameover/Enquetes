//Sequelize
const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USERNAME, "", {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    },
    timezone: '-03:00',
});

module.exports = sequelize;