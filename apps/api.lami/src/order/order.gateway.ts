import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
})
export class OrderGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Conected');
    })
  }

  changeStatus(data: any, userId: string) {
    this.server.emit(`changeStatusOrder${userId}`, {
      data
    });
  }

  createOrder(data: any, userId: string) {
    this.server.emit(`createOrder${userId}`, {
      data
    });
  }

  updateOrder(data: any, userId: string) {
    this.server.emit(`updateOrder${userId}`, {
      data
    });
  }

}
