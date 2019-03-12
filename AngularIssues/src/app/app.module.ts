import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { IssuesService } from './issues.service';
import { IssuesListComponent } from './issues-list/issues-list.component';

@NgModule({
  declarations: [
    AppComponent,
    IssuesListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    ConfigService,
    IssuesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
