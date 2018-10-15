import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {Relation, Word, WordsService} from '../words.service';


@Component({
  selector: 'app-relations-search',
  templateUrl: './relations-search.component.html',
  styleUrls: ['./relations-search.component.scss']
})
export class RelationsSearchComponent implements OnInit {

  searchedWord: any = [];
  searchedRelation: any = [];
  rIn: boolean;
  rOut: boolean;
  relations : any;


  constructor(private route: ActivatedRoute, private wordService: WordsService) {
  }

  ngOnInit() {

    this.route.params.subscribe(routeParams => {
      this.searchedWord = routeParams.word;
      this.searchedRelation = routeParams.queryParams.params.types;
      this.rIn = routeParams.queryParams.params.rIn;
      this.rOut = routeParams.queryParams.params.rOut;

      this.wordService.getAllRelations(this.searchedWord, this.searchedRelation, this.rIn, this.rOut).subscribe(result => {
        this.relations = result;
      })
      
    })
    /**
    this.route.params.subscribe(routeParams => {
      console.log('Params : ', routeParams);
      this.searchedWord = routeParams.word;
      this.searchedRelation = routeParams.types;

      this.wordService.searchWord(this.searchedWord).subscribe((result: Word) => {
        this.wordData = result;
        console.log('wordData : ' + this.wordData);
        this.wordService.getAllRelations(this.wordData).subscribe(result => {

          this.relations = result;
          console.log('relations : ' + this.relations);

          });
      });

    });
     **/
  }

}
