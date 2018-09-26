import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LoginService } from '../login.service';
import { LoginResInfo } from '../loginResInfo';

@Component({
  selector: 'app-accountinfo',
  templateUrl: './accountinfo.component.html',
  styleUrls: ['./accountinfo.component.css']
})
export class AccountinfoComponent implements OnInit {

  constructor(private loginService: LoginService,
    private location: Location
    ) { }

  ngOnInit() {
    this.getInfo();
  }

  getInfo(): void {
    console.log("getInfo try");
    this.accountDetail = this.loginService.GetLoginInfo();
  }

  goBack(): void {
    this.location.back();
  }


  @Input() accountDetail: LoginResInfo;
}
