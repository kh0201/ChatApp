import { Injectable } from '@angular/core';
import {WebSocketService} from './web-socket.service';
import {Observable, Subject} from 'rxjs/Rx';
import { LoginService } from './login.service';
import { chatInfo } from './chatInfo';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
	messages: Subject<any>;

	constructor(private wsService: WebSocketService, private loginService: LoginService) { 
		this.messages = <Subject<any>>wsService.connect().map((response: any): any=> {
			return response;
		})
	}
	
	sendMsg(msg)
	{
		let info = new chatInfo;
		info.id_ = this.loginService.GetID();
		info.msg_ = msg;
		this.messages.next(info);
	}
	
	
}
