import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {WordsModule} from './words/words.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatCardModule} from '@angular/material/card';
import { MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list'; // usefull later, to organise printing of search result



import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    WordsModule, BrowserModule, BrowserAnimationsModule, RouterModule,
    AppRoutingModule, MatCardModule, MatToolbarModule, MatDividerModule, MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
