const {Sequelize} = require('sequelize');


module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        pool: {
            max: 100, // Максимальное количество соединений в пуле
            min: 0,  // Минимальное количество соединений в пуле
            acquire: 10000, // Максимальное время в миллисекундах, которое будет потрачено на попытку установить соединение
            idle: 10000 // Время в миллисекундах, после которого неактивное соединение будет закрыто
        },
        logging: false, // Отключить или настроить логирование
    }
);
