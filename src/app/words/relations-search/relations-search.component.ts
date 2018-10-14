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
  wordData: any;
  relations: Relation[];

  constructor(private route: ActivatedRoute, private wordService: WordsService) {
  }

  ngOnInit() {
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
