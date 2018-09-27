import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordsComponent } from './words.component';
import { WordsSearchComponent } from './words-search/words-search.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: 'words-search/:word',
    component: WordsSearchComponent
  }
];


@NgModule({
  imports: [
    CommonModule, HttpClientModule, RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule
  ],
  exports: [WordsComponent, WordsSearchComponent, RouterModule],
  declarations: [WordsComponent, WordsSearchComponent],
  providers: []
})
export class WordsModule {}

