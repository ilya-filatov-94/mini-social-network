require('dotenv').config();
const express = require('express');
// const https = require('https');
const cors = require('cors');
const sequelize = require('./db');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

// const { Server } = require('socket.io');
// const socketsController = require('./controllers/socketsController');
const handlingSocketsEvents = require('./routes/socketsRouter');


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


const startApp = async () => {
    try {
        sequelize.authenticate()
            .then(() => console.log('Connected to PostgreSQL DB'))
            .catch((error) => console.log(`Error PostgreSQL connected ${error}`));
        await sequelize.sync();

        // const server = https.createServer(app).listen(PORT, () => console.log(`Server started on port ${PORT}`));
        const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

        handlingSocketsEvents(server);
        
        // const socket = new Server(server, {
        //     cors: {
        //       origin: [process.env.CLIENT_URL],
        //       credentials: true
        //     },
        // });
        // socket.on("connection", (socket) => {
        //     console.log("socket connection : ");
        //     socket.on('addUser', userId => {
        //         socketsController.addUser();
        //     });

        //     socket.on("disconnect", () => {
        //         console.log("a user disconnected!");
        //         removeUser(socket.id);
        //         io.emit("getUsers", users);
        //     });
        // });


    } catch (error) {
        console.log(error);
    }
}

startApp();