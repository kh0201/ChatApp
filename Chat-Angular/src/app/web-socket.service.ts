import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable} from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import {environment} from '../environments/environment';
import {loginInfo} from './loginInfo';
import { chatInfo } from './chatInfo';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

	private socket;

	constructor() { }
	connectToLogin() : Rx.Subject<MessageEvent>{
		this.socket = io('http://localhost:5000/');
	  
		let loginObservable = new Observable(loginObserver => {

			this.socket.on('loginRpt', (id) => {
				console.log("Received a loginRpt from websocket server");
				loginObserver.next(id); })
			return ()=>{ this.socket.disconnect();}
		});
	  
		let loginObserver = {
		  
			next: (info: loginInfo)=> {
				this.socket.emit('loginRpt', JSON.stringify(info.id_), JSON.stringify(info.pw_));
			}
		};
	  
	   return Rx.Subject.create(loginObserver, loginObservable);
	}
  
	connectToRegister() : Rx.Subject<MessageEvent>{
	  
		this.socket = io('http://localhost:5000/');
	  
		let registerObservable = new Observable(registerObserver => {
			this.socket.on('registerRpt', (id) => {
			  console.log("Received a registerRpt from websocket server");
			  registerObserver.next(id); }) 
			  return ()=>{ this.socket.disconnect();}
		});
	  
		let registerObserver = {
			next: (info: loginInfo)=> {
			  this.socket.emit('registerRpt', JSON.stringify(info.id_), JSON.stringify(info.pw_),
			  JSON.stringify(info.name_), JSON.stringify(info.email_), JSON.stringify(info.comment_), JSON.stringify(info.phone_)
			  );
			}
		};
	  
		return Rx.Subject.create(registerObserver, registerObservable);
	}
  
	connect() : Rx.Subject<MessageEvent>{
	  this.socket = io('http://localhost:5000/');
	  
	  let observable = new Observable(observer => {
		  this.socket.on('message', (data) => {
			  console.log("Received a message from websocket server");
			  observer.next(data);
		  })
		  return ()=>{
			  this.socket.disconnect();
		  }

	  })
	  
	  let observer = {
		  next: (data: chatInfo)=> {
			  console.log(data);
			  this.socket.emit('message', data.id_, data.msg_);
		  },		
	  };
	  
	  return Rx.Subject.create(observer, observable);
  }
}
