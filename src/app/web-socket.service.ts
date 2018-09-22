import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable} from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import {environment} from '../environments/environment';
import {loginInfo} from './loginInfo';

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
			  this.socket.emit('registerRpt', JSON.stringify(info.id_), JSON.stringify(info.pw_));
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
		  next: (data: Object)=> {
			  this.socket.emit('message', JSON.stringify(data));
		  },		
	  };
	  
	  return Rx.Subject.create(observer, observable);
  }
}
