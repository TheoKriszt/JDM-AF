import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {RelationTypes, WordsService} from './words.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatIconRegistry} from '@angular/material';
import {MatAutocompleteSelectedEvent} from '@angular/material/typings/autocomplete';
import {DomSanitizer} from '@angular/platform-browser';
import {MatButtonToggle} from '@angular/material';


@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css']
})
export class WordsComponent implements OnInit {

  // Search Params
  loading = false;
  // model: any;
  nameControl = new FormControl();
  options: string[] = [/*'Martin', 'Mary', 'Shelley', 'Igor'*/];
  filteredOptions: Observable<string[]>;

// Relations params
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  relationCtrl = new FormControl();
  relations: string[] = [];
  allRelations: string[] = [];
  filteredRelations: string[];

  // = this.allRelations;

  rIn: boolean;
  rOut: boolean;


  @ViewChild('relationInput') relationInput: ElementRef<HTMLInputElement>;

  constructor(private router: Router, private wordService: WordsService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {

    this.relationCtrl.valueChanges.subscribe(value => {
      if (value) {
        this.filteredRelations = this.allRelations.filter(term => {
          return term.indexOf(value) >= 0;
        });
      } else {
        this.filteredRelations = this.allRelations;
      }

    });

    iconRegistry.addSvgIcon(
      'cancel',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/cancel.svg')
    );
  }


  ngOnInit() {
    this.nameControl.valueChanges.subscribe(name => {
      if (name.length > 0) {

        this.filteredOptions = this.wordService.autocomplete(name);
      } else {
        this.loading  = false;
      }
    });

    this.wordService.getRelationsTypes().subscribe( (data: RelationTypes) => {
      console.log(data);

      for (let i = 0, size =  data.types.length; i < size; i++) {
          console.log(data.types[i]);
          this.allRelations.push(data.types[i].name);
      }
    });

    this.filteredRelations = this.allRelations;
  }

  submitWordSearch() {
    this.loading = true;

    if (this.nameControl.value) {
      const params = {
        types : this.relations,
        rIn : this.rIn,
        rOut : this.rOut
      };
      this.router.navigate(['/words', 'words-search', this.nameControl.value], {queryParams: params});
    }
    this.loading = false;

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our relation
    // if ((value || '').trim()) {
    //   this.relations.push(value.trim());
    // }

    // Reset the input value
    // if (input) {
    //   input.value = '';
    // }

    this.relationCtrl.setValue(null);
  }

  remove(relation: string): void {
    const index = this.relations.indexOf(relation);
    if (index >= 0) {
      this.relations.splice(index, 1);
      this.allRelations.push(relation);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value: string = event.option.viewValue;
    // if ( this.allRelations.indexOf(value) >= 0 ) { // N'ajouter que les résultats proposés
    //
    // }
    this.relations.push(value);
    this.allRelations.splice(this.allRelations.indexOf(value), 1);


    this.relationInput.nativeElement.value = '';
    this.relationCtrl.setValue(null);
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //
  //   // console.log('Relation selectionnée : ', value);
  //   // console.log('Selection actuelle: ', this.relations);
  //
  //   const filtered = this.allRelations.filter(relation => relation.toLowerCase().indexOf(filterValue) === 0);
  //   // this.allRelations.splice(this.allRelations.indexOf(filterValue), 1);
  //
  //   // console.log('retour de relations : ', filtered);
  //
  //   return filtered;
  // }

}
