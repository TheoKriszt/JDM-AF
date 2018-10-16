import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Word, WordsService} from '../words.service';

@Component({
  selector: 'app-words-search',
  templateUrl: './words-search.component.html',
  styleUrls: ['./words-search.component.css']
})
export class WordsSearchComponent implements OnInit {
  private orderByParam = '';
  loading = true;
  searchedWord = '';
  words: any = {};

  constructor(private route: ActivatedRoute, private wordService: WordsService) { }

  ngOnInit() {

    this.route.params.subscribe(routeParams => {
      // console.log('Params : ', routeParams);
      this.searchedWord = routeParams.word;
      this.loading = true;

      this.wordService.searchWord(this.searchedWord).subscribe((result: Word) => {

        this.words  = result;
        console.log(this.words);
        this.loading = false;
      });

    });
  }

}
