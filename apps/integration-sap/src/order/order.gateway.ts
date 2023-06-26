import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
})
export class OrderGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;

  connectedClients: Socket[] = [];

  handleConnection(client: Socket) {
    this.connectedClients.push(client);
    // Handle new WebSocket connection
  }

  handleDisconnect(client: Socket) {
    this.connectedClients = this.connectedClients.filter(c => c !== client);
    // Handle WebSocket disconnection
  }


  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Conected');
    })
  }

  changeStatus(data: any, userId: string) {
    console.log(`changeStatusOrder${userId}`);
    // this.connectedClients.forEach(client => {
    //   client.emit(`changeStatusOrder${userId}`, data);
    // });
    this.server.emit(`changeStatusOrder${userId}`, data);
  }

  createOrder(data: any, userId: string) {
    this.server.to(userId).emit(`createOrder${userId}`, data);
  }

  updateOrder(data: any, userId: string) {
    this.server.emit(`updateOrder${userId}`, data);
  }

}
