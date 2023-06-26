import { OnModuleInit } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class CustomerGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Conected');
    })
  }

  changeStatus(data: any, userId: string) {
    this.server.emit(`changeStatusCustomer${userId}`, data);
  }

  // createOrder(data: any, userId: string) {
  //   this.server.emit(`createOrder${userId}`, {
  //     data
  //   });
  // }

  // updateOrder(data: any, userId: string) {
  //   this.server.emit(`updateOrder${userId}`, {
  //     data
  //   });
  // }

}
