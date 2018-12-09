import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WordsService} from '../words.service';


@Component({
  selector: 'app-relations-search',
  templateUrl: './relations-search.component.html',
  styleUrls: ['./relations-search.component.scss']
})
export class RelationsSearchComponent implements OnInit {

  @Input()
    params: any;
  searchedWord: string;
  searchedRelationsTypes: any = [];
  rIn: boolean;
  rOut: boolean;
  sortChecked: boolean;
  relations: any = {
    relationOut : [],
    relationIn : []
  };

  step = 0;
  loading: boolean;

  constructor(private route: ActivatedRoute, private wordService: WordsService) {
  }

  ngOnInit() {
    this.loading = true;
    this.searchedWord = this.params.searchedWord;
    this.rIn = this.params.rIn;
    this.rOut = this.params.rOut;
    this.searchedRelationsTypes = this.params.searchedRelationsTypes;
    this.sortChecked = this.params.sortChecked;


    if (this.searchedWord) {
      this.wordService.getAllRelations(this.searchedWord, this.searchedRelationsTypes, this.rIn, this.rOut, this.sortChecked).subscribe(result => {
        this.relations = result;

        // delete this.relations.relationIn[0];
        // delete this.relations.relationOut[0];

        console.log('Relations entrante : \n', this.relations.relationIn[1]);
        console.log('Relations sortante : \n', this.relations.relationOut[1]);
        this.loading = false;
      });
    }
  }

  setStep(index: number) {
    this.step = index;
    console.log('step : ' + this.step);
  }

  nextStep() {
    this.step++;
    console.log(' step : ' + this.step);
  }

  prevStep() {
    this.step--;
    console.log('step : ' + this.step);
  }

}
