const express = require('express');
const path = require('path');
const {Server} = require('socket.io');
const {createServer} = require('http');

const app = express();
require('dotenv').config();

app.set('port', process.env.PORT);

app.use(express.static(path.join(__dirname, 'public')));

const httpServer = createServer(app);
const io = new Server(httpServer);

const lineHistory = [];
io.on('connection', socket =>{
    console.log('new connection', socket.id);
    for(let i in lineHistory){
        socket.emit('draw-line', {line: lineHistory[i]});
    }
    socket.on('draw-line', data =>{
        lineHistory.push(data.line);
        io.emit('draw-line', data);
    });
});

httpServer.listen(app.get('port'), _ =>{
    console.log(`server on port ${app.get('port')}`);
});

