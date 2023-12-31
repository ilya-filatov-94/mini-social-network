require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
// const https = require('https');
const cors = require('cors');
const sequelize = require('./db');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const handlingSocketsEvents = require('./gateway/socketsGateway');

const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: [process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders: ['set-cookie'],
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'static'))); 
app.use(fileUpload({}));
app.use('/api', router);
app.use(errorHandler);

const server = http.createServer(app);
const socketIO = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL],
      credentials: true
    },
});

const startApp = async () => {
    try {
        sequelize.authenticate()
            .then(() => console.log('Connected to PostgreSQL DB'))
            .catch((error) => console.log(`Error PostgreSQL connected ${error}`));
        await sequelize.sync();

        // const server = https.createServer(app).listen(PORT, () => console.log(`Server started on port ${PORT}`));
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
        handlingSocketsEvents(socketIO);

    } catch (error) {
        console.log(error);
    }
}

startApp();