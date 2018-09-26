import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LoginService } from '../login.service';
import { loginInfo } from '../loginInfo';

@Component({
  selector: 'app-accountinfo',
  templateUrl: './accountinfo.component.html',
  styleUrls: ['./accountinfo.component.css']
})
export class AccountinfoComponent implements OnInit {

  constructor(private loginService: LoginService,
    private location: Location) { }

  ngOnInit() {
    this.getInfo();
  }

  getInfo(): void {
    //this.loginService.GetInfo();
  }

  goBack(): void {
    this.location.back();
  }


  @Input() accountDetail: loginInfo;
}
