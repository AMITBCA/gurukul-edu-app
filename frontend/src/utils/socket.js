import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true
});

export const initSocket = (role) => {
    socket.on('connect', () => {
        console.log(`Connected to Socket server as ${role}:`, socket.id);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from Socket server');
    });

    return socket;
};
