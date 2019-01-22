import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WordsService} from '../words.service';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-words-search',
  templateUrl: './words-search.component.html',
  styleUrls: ['./words-search.component.css']
})
export class WordsSearchComponent implements OnInit, HttpInterceptor {
  loading = true;
  searchedWord = '';
  word: any = {formatedWord : 'Chargement ...', definitions : []};
  searchedRelationsTypes: string[] = [];
  rIn: boolean;
  rOut: boolean;
  private sortChecked: boolean;
  imageUrl = '';

  relationsParams = {
    searchedWord: this.searchedWord,
    searchedRelationsTypes: this.searchedRelationsTypes,
    rIn: this.rIn,
    rOut: this.rOut,
    sortChecked: this.sortChecked,
    wordExists: true
  };

  constructor(private route: ActivatedRoute, private wordService: WordsService) {
  }

  ngOnInit() {
    this.route.params.pipe().subscribe(routeParams => {
      this.loading = true;

      this.searchedWord = routeParams.word;
      this.word.formatedWord = this.searchedWord;
      this.word.definitions = [];

      this.imageUrl = this.wordService.getImageFor(this.searchedWord);

      this.route.queryParams.pipe()
        .subscribe( params => {
          // this.loading = true;
          // console.log('words-serach-component : params changes', JSON.stringify(params));
          this.searchedRelationsTypes = params.types;
          this.rIn = params.rIn;
          this.rOut = params.rOut;
          this.sortChecked = params.sortChecked;
          this.loading = true;

          console.log('searchWord(' + this.searchedWord + ')');
          this.wordService.searchWord(this.searchedWord).pipe(first()).subscribe((result) => {
            if (result.statusCode && result.statusCode === 404) { // not found
                // this.word.definitions = [];
                this.word.formatedWord = this.searchedWord;
              this.relationsParams.wordExists = false;
            } else if (result.statusCode && result.statusCode === 503) { // timeout
              console.log('503');
            } else {
              if (result.formatedWord === this.searchedWord) {
                console.log('word search result : ', result);
                this.word  = result;
                this.relationsParams.wordExists = true;
              }

            }
            this.loading = false;
            // console.log('loaded');
          });
        } );

    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepting error : ', req, next);
    return undefined;
  }
}
