
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {RelationTypes, Type, WordsService} from './words.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatIconRegistry} from '@angular/material';
import {MatAutocompleteSelectedEvent} from '@angular/material/typings/autocomplete';
import {DomSanitizer} from '@angular/platform-browser';


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
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  checked = true;

// Relations params
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  relationCtrl = new FormControl();
  sendRelations: string[] = [];
  relations: Type[] = [];
  allRelations: Type[] = [];
  filteredRelations: Type[];

  rIn = true;
  rOut = true;


  @ViewChild('relationInput') relationInput: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private wordService: WordsService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer) {

    this.relationCtrl.valueChanges.subscribe(value => {
      if (value) {
        this.filteredRelations = this.allRelations.filter(term => {
          return term.name.indexOf(value) >= 0;
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
    console.log('WordComponent :: init');
    this.nameControl.valueChanges.subscribe(name => {
      if (name.length > 0) {

        this.filteredOptions = this.wordService.autocomplete(name);
      } else {
        this.loading  = false;
      }
    });

    this.wordService.getRelationsTypes().subscribe( (data: RelationTypes) => {
      // console.log('RelationTypes : ', JSON.stringify(data));
      // this.allRelations = [];
      for (let i = 0, size =  data.types.length; i < size; i++) {
        this.allRelations.push(data.types[i]);
        // console.log('allRelations : ' , JSON.stringify(data));
      }
    });

    this.filteredRelations = this.allRelations;
  }

  submitWordSearch() {
    this.loading = true;

    if (this.nameControl.value) {
      const params = {
        types : this.sendRelations,
        rIn : this.rIn,
        rOut : this.rOut,
        sortChecked : this.checked
      };
      console.log('relations cherchées : ', JSON.stringify(this.sendRelations));
      this.router.navigate(['/words', 'words-search', this.nameControl.value], {queryParams: params});
    }
    this.loading = false;

  }

  add(event: MatChipInputEvent): void {
    this.relationCtrl.setValue(null);
  }

  remove(relation: Type): void {
    const index = this.relations.indexOf(relation);
    if (index >= 0) {
      this.relations.splice(index, 1);
      let insertAt = 0;
      while (this.allRelations[insertAt].id < relation.id) {
        insertAt++;
      }
      this.allRelations.splice(insertAt, 0, relation);
    }
    console.log('apres suppression : ' , JSON.stringify(this.relations));
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value: Type = this.allRelations.filter(function(relation) {
      return relation.name === event.option.viewValue;
    })[0];

    this.relations.push(value);
    this.sendRelations.push(value.name);
    this.allRelations.splice(this.allRelations.indexOf(value), 1);

    console.log(value);
    this.relationInput.nativeElement.value = '';
    this.relationCtrl.setValue(null);
  }



}
