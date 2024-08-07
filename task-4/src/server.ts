
import app from './app';
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { checkAlerts } from './services/alertService';
console.log('server start hit')
const httpServer = new Server(app);
const io = new SocketIOServer(httpServer);
console.log('server hit')
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Handle socket events and send alerts
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Check alerts every minute
setInterval(checkAlerts, 60000);

const PORT = 6678;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
