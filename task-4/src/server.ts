
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
    socket.on('joinRoom', (user) => {
        socket.join(user);
        console.log(`User ${user} joined room ${user}`);
    });
});

// Check alerts every minute
setInterval(async () => {
    try {
        const alerts = await checkAlerts();
        
        if (alerts[0]!==-1){alerts.forEach((alert:any)=> {
            // Send the alert to the user's room
            io.to(alert.user).emit('alert', alert.message);
            //console.log(`emitted alert ${alert}`)
        })};
    } catch (error) {
        console.error('Error checking alerts:', error);
    }
}, 60000);

const PORT = 6678;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
