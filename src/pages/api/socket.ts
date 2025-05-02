import type { NextApiRequest } from 'next';
import type { NextApiResponseWithSocket } from '@/types/socket';
import { Server } from 'socket.io';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponseWithSocket
) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server, {
            path: '/api/socket',
        });

        res.socket.server.io = io;

        io.on('connection', (socket) => {
            console.log('🟢 Cliente conectado:', socket.id);

            socket.on('message', (msg) => {
                socket.broadcast.emit('message', msg);
            });

            socket.on('disconnect', () => {
                console.log('🔴 Cliente desconectado:', socket.id);
            });
        });
    }

    res.end();
}
