import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Word, WordsService} from '../words.service';

@Component({
  selector: 'app-words-search',
  templateUrl: './words-search.component.html',
  styleUrls: ['./words-search.component.css']
})
export class WordsSearchComponent implements OnInit {
  loading = true;
  searchedWord = '';
  words: any = {formatedWord : '', definitions : []};
  searchedRelationsTypes: string[] = [];
  rIn: boolean;
  rOut: boolean;
  private sortChecked: boolean;
  imageUrl = '';

  constructor(private route: ActivatedRoute, private wordService: WordsService) { }

  ngOnInit() {

    this.route.params.subscribe(routeParams => {
      this.loading = true;

      this.searchedWord = routeParams.word;

      this.imageUrl = this.wordService.getImageFor(this.searchedWord);

      this.route.queryParams
        .subscribe( params => {
          this.searchedRelationsTypes = params.types;
          this.rIn = params.rIn;
          this.rOut = params.rOut;
          this.sortChecked = params.sortChecked;

          this.wordService.searchWord(this.searchedWord).subscribe((result: Word) => {
            // this.words = undefined;
            this.words  = result;
            this.loading = false;
          });
        } );

    });
  }

  /**
   * Génère les paramètres pour créer le sous-composant relations-search
   */
  relationsParams(): any {
    return {
      searchedWord : this.searchedWord,
      searchedRelationsTypes : this.searchedRelationsTypes,
      rIn : this.rIn,
      rOut : this.rOut,
      sortChecked : this.sortChecked
    };
  }
}
