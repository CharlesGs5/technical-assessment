// src/types/socket.d.ts
import type { NextApiResponse } from 'next';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';
import type { Server as IOServer } from 'socket.io';

export type NextApiResponseWithSocket = NextApiResponse & {
    socket: NetSocket & {
        server: HTTPServer & {
            io?: IOServer;
        };
    };
};
