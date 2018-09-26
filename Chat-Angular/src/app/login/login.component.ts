import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from '../login.service';
import { LoginResInfo } from '../LoginResInfo';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	constructor(private login: LoginService, private router: Router) {
	}
	loginResInfo: LoginResInfo;

	ngOnInit() {
		this.login.loginMessages_.subscribe(msg => {

			/*
			if(msg == 'Succeed')
			{
				this.login.SetLoggedIn(true);
				this.router.navigate(['/chat']);
				// 주소 이동 /chat 으로
				console.log("subscribe msg " + msg);
			}
			else if(msg == 'Fail')
			{
				// 실패 메시지 박스 출력?
				console.log("subscribe msg " + msg);
			}*/
			if(msg == 'Fail')
			{
				console.log("subscribe msg " + msg);
			}
			else
			{
				this.login.SetLoginInfo(msg);
				this.login.SetLoggedIn(true);
				this.router.navigate(['/chat']);
				console.log("login Succeed : " + msg.id + msg.name + msg.email, msg.password);
			}
			

		})
		this.login.registerMessages_.subscribe(msg => {
			if (msg == 'Succeed') {
				// 성공 메시지 박스 출력?
			}
			else if (msg == 'Fail') {
				// 실패 메시지 박스 출력?
			}

			console.log("subscribe msg " + msg);
		})
	}

	LoginReq(id: string, pw: string) {
		console.log("Login Rpt!");
		this.login.LoginReq(id, pw);
	}

	RegisterRpt(id: string, pw: string, name: string, email: string, comment: string, phone: number) {
		console.log("RegisterRpt!");
		this.login.RegisterRpt(id, pw, name, email, comment, phone);
	}
}
