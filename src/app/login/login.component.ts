import { Component, OnInit } from '@angular/core';
import {LoginService} from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	constructor(private login: LoginService) { }

	ngOnInit() {
		this.login.loginMessages_.subscribe(msg => {
			console.log("subscribe msg" + msg);
	})
		this.login.registerMessages_.subscribe(msg => {
			console.log("subscribe msg" + msg);
	})
	}

	LoginRpt(id: string , pw: string)
	{
		console.log("Login Rpt!");
		this.login.LoginRpt(id, pw);
	}
	
	RegisterRpt(id: string, pw: string)
	{
		console.log("RegisterRpt!");
		this.login.RegisterRpt(id, pw);
	}
}
