import { Injectable } from '@angular/core';
import {WebSocketService} from './web-socket.service';
import * as io from 'socket.io-client';
import { Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Rx';
import {environment} from '../environments/environment';
import {loginInfo} from './loginInfo';
import { LoginResInfo } from './LoginResInfo';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

	loginMessages_ : Subject<any>;
	registerMessages_ : Subject<any>;
	loggedIn : boolean;
	ID : string;
	loginResInfo : LoginResInfo;

	GetLoginInfo()
	{
		console.log("GetLoginInfo");
		return this.loginResInfo;
	}
	SetLoginInfo(info: LoginResInfo)
	{
		this.loginResInfo = info;
	}

	SetLoggedIn(flag: boolean)
	{
		this.loggedIn = flag;
	}

	GetID()
	{
		return this.ID;
	}

	IsLoggedIn()
	{
		return this.loggedIn;
	}

	constructor(private wsService: WebSocketService) { 
		this.loginMessages_ = <Subject<any>>wsService.connectToLogin().map((loginRes: any): any=> {
			return loginRes;
		})
		
		this.registerMessages_ = <Subject<any>>wsService.connectToRegister().map((registerRes: any): any=> {
			return registerRes;
		})
		
	}
	
	LoginReq(id, pw)
	{
		console.log("loginReq!!");
		let info = new loginInfo;
		info.id_ = id;
		info.pw_ = pw;
		this.ID = id;
		this.loginMessages_.next(info);
	}
	
	RegisterRpt(id, pw, name, email, comment, phone)
	{
		console.log("RegisterRpt!!");
		let info = new loginInfo;
		info.id_ = id;
		info.pw_ = pw;
		info.name_ = name;
		info.email_ = email;
		info.comment_ = comment;
		info.phone_ = phone;

		this.registerMessages_.next(info);
	}
}
