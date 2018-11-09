import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WordsService} from '../words.service';


@Component({
  selector: 'app-relations-search',
  templateUrl: './relations-search.component.html',
  styleUrls: ['./relations-search.component.scss']
})
export class RelationsSearchComponent implements OnInit {

  // Le décorateur Input injecte le parametre dans l'attribut à la construction du composant
  // ex ;<app-relations-search [searchedWord] = word ></app-relations-search>
  @Input()
    params: any;
  searchedWord: string;
  searchedRelationsTypes: any = [];
  rIn: boolean;
  rOut: boolean;
  relations: any = {
    relationOut : [],
    relationIn : []
  };
  // private loading: boolean;

  step = 0;

  constructor(private route: ActivatedRoute, private wordService: WordsService) {
  }

  ngOnInit() {
    // this.loading = true;
    this.searchedWord = this.params.searchedWord;
    this.rIn = this.params.rIn;
    this.rOut = this.params.rOut;
    this.searchedRelationsTypes = this.params.searchedRelationsTypes;

    console.log('from relations ::: ', 'rIn', this.rIn, 'rOut', this.rOut);

    if (this.searchedWord) {
      // console.log('Recherche des relations liées au terme "' , this.searchedWord, '"');
      this.wordService.getAllRelations(this.searchedWord, this.searchedRelationsTypes, this.rIn, this.rOut).subscribe(result => {
        this.relations = result;

        console.log('Relations entrante : \n', this.relations.relationIn);
        console.log('Relations sortante : \n', this.relations.relationOut);


        // this.loading = false;

      });
    }
  }

  setStep(index: number) {
    this.step = index;
    console.log("step : " + this.step);
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
