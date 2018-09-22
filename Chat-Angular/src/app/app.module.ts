import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChatService} from './chat.service';
import { LoginService} from './login.service';
import { WebSocketService } from './web-socket.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ApproutingModule} from './approuting/approuting.module';
import { ChatComponent } from './chat/chat.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
	ApproutingModule
  ],
  providers: [
	ChatService,
	LoginService,
	WebSocketService
  ],
  bootstrap: [LoginComponent]
})
export class AppModule { }
