import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {RelationTypes, Type, WordsService} from '../words.service';
import {isDefined} from '@angular/compiler/src/util';
import {first} from 'rxjs/operators';


@Component({
  selector: 'app-relations-search',
  templateUrl: './relations-search.component.html',
  styleUrls: ['./relations-search.component.scss']
})
export class RelationsSearchComponent implements OnInit, OnChanges {

  static searchingRelations = false;

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

  wordExists = true;

  subscribedRoute = false;



  step = 0;
  loading: boolean;
  private relationsTypes: Type[];

  constructor(private route: ActivatedRoute, private wordService: WordsService) {
  }

  ngOnInit() {
    this.loading = true;
    this.wordService.getRelationsTypes().subscribe(relationsTypes => {
      this.relationsTypes = relationsTypes.types;
    });
    this.searchedWord = this.params.searchedWord;
    this.route.params.subscribe( params => {
      if (!this.searchedWord) {
        this.searchedWord = params.word;
      }
    });

    this.searchedRelationsTypes = this.params.searchedRelationsTypes; // TODO : remove ?

    if (! this.subscribedRoute) {
      this.subscribedRoute = true;
      this.route.queryParams.pipe(first()).subscribe(params => {
        // console.log('relations-search : params changed', JSON.stringify(params));

        this.rIn = params.rIn === 'true';
        this.rOut = params.rOut === 'true';
        this.sortChecked = params.sortChecked === 'true';
        this.searchedRelationsTypes = params.types;


        if (this.searchedRelationsTypes && this.searchedRelationsTypes.length  && (this.rIn || this.rOut)) {
          this.searchRelations();
        } else {
          // console.log('pas de relations à afficher : ', JSON.stringify(this.searchedRelationsTypes));
          this.loading = false;
        }
      });
    }




  }

  searchRelations() {
    if (RelationsSearchComponent.searchingRelations) {
      console.log('already searching relations...');
    }
    // console.log('recherche des relations pour le mot' , this.searchedWord);
    if (this.searchedWord) {
      this.loading = true;
      console.log('recherche des relations pour ' + this.searchedWord);
      // if (!this.searchingRelations) {
      RelationsSearchComponent.searchingRelations = true;

        this.wordService.getAllRelations(
          this.searchedWord,
          this.searchedRelationsTypes,
          this.rIn,
          this.rOut,
          this.sortChecked).pipe(first()).subscribe(result => {
          console.log('relations retournées : ', result);
          RelationsSearchComponent.searchingRelations = false;

          if ( result.statusCode && result.statusCode === 423 ) { // ressource locked, try again
            this.searchRelations();
          } else {
            this.relations = result;
            this.loading = false;
          }
      });
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const params: Params = changes.params;

    if (isDefined(params.currentValue.wordExists)) {
      this.wordExists = params.currentValue.wordExists;
    }

  }

  getRelationTypedefinition(relationType: string): string {
    for (const type of this.relationsTypes) {
      if (type.name === relationType) {
        return type.definition;
      }
    }

      return null;
  }

}
