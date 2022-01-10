
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  chatForm = document.getElementById('chat-form')
  msg: any
  // addUser!: FormGroup;
  message= "*message*"
  messageArr:Array<{message:any}>= []


  constructor(
    private socketService: SocketService,
    private fb: FormBuilder,
    private socket:Socket
    ) {
      // this.addUser = this.fb.group({messages:['', Validators.required]})
      socket.on('serverToClient', (payload:string)=>{this.message=payload})
    
    }

  ngOnInit() {
    this.socketService.getMessage().subscribe(message => { console.log(message); });
    // this.socket.on('message', (message: any)=> {
    //   console.log(message)
    // })

  }
  sendMessage(messageInput:any ){

 this.messageArr.push(messageInput)
// this.socketService.getMessage().subscribe((data:{message:string}) => this.messageArr.push(data))
console.log("new message",this.messageArr)

  }

}
