import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { ChatComponent} from '../chat/chat.component';
import { LoginComponent} from '../login/login.component';
import { AuthGuard } from '../auth.guard';


const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'chat', component: ChatComponent, canActivate: [AuthGuard] }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})

export class ApproutingModule { 
}
