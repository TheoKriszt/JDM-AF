import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordsComponent } from './words.component';
import { WordsSearchComponent } from './words-search/words-search.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import { MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { RelationsSearchComponent } from './relations-search/relations-search.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';



const routes: Routes = [
  // {
  //   path: 'words-search/:word/relation',
  //   component: RelationsSearchComponent,
  //   outlet: 'relations',
  // },
  {
    path: 'words-search/:word',
    component: WordsSearchComponent,
    // children: [
    //   {
    //     path : 'relation',
    //     component : RelationsSearchComponent,
    //     // outlet: 'relations'
    //   }
    // ]
  },

];


@NgModule({
  imports: [
    CommonModule, HttpClientModule, RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, MatButtonModule, MatAutocompleteModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatChipsModule, MatIconModule,
    MatDividerModule, MatButtonToggleModule,MatCardModule
  ],
  exports: [WordsComponent, WordsSearchComponent, RelationsSearchComponent, RouterModule],
  declarations: [WordsComponent, WordsSearchComponent, RelationsSearchComponent],
  providers: []
})
export class WordsModule {}

