import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WordsService} from '../words.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';


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

    this.searchedRelationsTypes = this.params.searchedRelationsTypes;

    this.route.queryParams.subscribe(params => {
      console.log('relations-search : params changed');
      console.log(params);

      this.rIn = this.params.rIn;
      this.rOut = this.params.rOut;
      this.sortChecked = this.params.sortChecked;

      if (this.searchedRelationsTypes && (this.rIn || this.rOut) ) {
        this.searchRelations();
      } else {
        console.log('pas de relations à afficher');
        this.loading = false;
      }
    });



  }

  searchRelations() {
    if (this.searchedWord) {
      // console.log('recherche des relations pour ' + this.searchedWord);
      this.wordService.getAllRelations(
        this.searchedWord,
        this.searchedRelationsTypes,
        this.rIn,
        this.rOut,
        this.sortChecked).subscribe(result => {
        this.relations = result;
        console.log('relations retournées : ', JSON.stringify(this.relations));
        // delete this.relations.relationIn[0];
        // delete this.relations.relationOut[0];
        // console.log('relations totales IN: ', JSON.stringify(this.relations));
        //
        // if (this.relations.relationIn.length[0]) {
        //   console.log('Au moins', this.relations.relationIn.length[0].length + ' relations entrantes');
        // }
        //
        // if (this.relations.relationOut.length[0]) {
        //   console.log('Au moins ', this.relations.relationOut.length[0].length + ' relations sortantes');
        // }

        this.loading = false;
      });
    }
  }

  setStep(index: number) {
    this.step = index;
    // console.log('step : ' + this.step);
  }

  nextStep() {
    this.step++;
    // console.log(' step : ' + this.step);
  }

  prevStep() {
    this.step--;
    // console.log('step : ' + this.step);
  }

}
