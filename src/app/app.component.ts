import { Component, OnInit } from '@angular/core';
import {ChatService} from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
	
	messages: string[] = [];
	
  constructor(private chat: ChatService){}
  
  ngOnInit(){
	this.chat.messages.subscribe(msg => {
		this.messages.push(msg);
	})
	  
  }
  
  sendMessage(message: string)
  {
	  this.chat.sendMsg(message);
  }
  
}
