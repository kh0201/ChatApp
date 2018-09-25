import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private loginService: LoginService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.loginService.IsLoggedIn()){
      console.log("Login True");
      return true;
    }
    else{
      console.log("Login False");
      alert("Please login first");
      this.router.navigate(['login'],{ queryParams: { redirectTo: state.url } });
      return false;
    }
  }
}
