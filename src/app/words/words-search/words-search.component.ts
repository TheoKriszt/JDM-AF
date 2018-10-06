import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {WordsService} from '../words.service';

@Component({
  selector: 'app-words-search',
  templateUrl: './words-search.component.html',
  styleUrls: ['./words-search.component.css']
})
export class WordsSearchComponent implements OnInit {
  private orderByParam = '';
  loading: boolean;
  searchedWord = '';
  words: any = {};

  constructor(private route: ActivatedRoute, private wordService: WordsService) { }

  ngOnInit() {
    this.loading = true;

   this.searchedWord = this.route.snapshot.params['word'];

   if (this.searchedWord) {
     console.log('recherche du terme ' + this.searchedWord)
     this.wordService.searchWord(this.searchedWord).subscribe(result => {
       console.log('DONE');
       this.words  = result;
       this.loading = false;
     });
   }
  }

}
