const Sequelize = require("sequelize");
const database = require("./config");

const Enquetes = database.define(
    "enquetes",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        uniq_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        titulo: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        votos_total: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        data_inicio: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        data_termino: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

const EnqueteOpcoes = database.define(
    "enquetes_opcoes",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        id_enquete: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        titulo_opcao: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        votos_opcao: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        timestamps: false,
    }
);

//Enquetes.sync();
//EnqueteOpcoes.sync();

module.exports = {
    Enquetes,
    EnqueteOpcoes,
};
