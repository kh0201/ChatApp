import { Component, OnInit } from '@angular/core';
import {ChatService} from '../chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  
  messages: string[] = [];

  constructor(private chat: ChatService) { }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      this.messages.push(msg);
    })
  }

  sendMessage(message: string)
  {
	  this.chat.sendMsg(message);
  }
	
}
