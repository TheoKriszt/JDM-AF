
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {RelationTypes, WordsService} from './words.service';
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
  relations: string[] = [];
  allRelations: string[] = [];
  filteredRelations: string[];

  rIn = true;
  rOut = true;


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
      for (let i = 0, size =  data.types.length; i < size; i++) {
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
        rOut : this.rOut,
        sortChecked : this.checked
      };
      this.router.navigate(['/words', 'words-search', this.nameControl.value], {queryParams: params});
    }
    this.loading = false;

  }

  add(event: MatChipInputEvent): void {
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

    this.relations.push(value);
    this.allRelations.splice(this.allRelations.indexOf(value), 1);


    this.relationInput.nativeElement.value = '';
    this.relationCtrl.setValue(null);
  }



}
