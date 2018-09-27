import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordsComponent } from './words.component';
import { WordsSearchComponent } from './words-search/words-search.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [WordsComponent, WordsSearchComponent]
})
export class WordsModule { }
