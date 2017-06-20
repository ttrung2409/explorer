import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {ExplorerComponent} from './explorer.component';
import {FocusDirective} from '../directives/focus';
import {FileUploadComponent} from './fileUpload.component';

@NgModule({
  declarations: [
      AppComponent,
      ExplorerComponent,
      FocusDirective,
      FileUploadComponent      
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
