import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { LoginService } from './login.service';
import { WebSocketService } from './web-socket.service';
import { AuthGuard } from './auth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ApproutingModule } from './approuting/approuting.module';
import { ChatComponent } from './chat/chat.component';
import { AccountinfoComponent } from './accountinfo/accountinfo.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    AccountinfoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ApproutingModule
  ],
  providers: [
    ChatService,
    LoginService,
    WebSocketService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
