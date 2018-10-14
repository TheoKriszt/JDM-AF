import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {WordsService} from './words.service';
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
  model: any;
  nameControl = new FormControl();
  options: string[] = ['Martin', 'Mary', 'Shelley', 'Igor'];
  filteredOptions: Observable<string[]>;

// Relations params
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  relationCtrl = new FormControl();
  filteredRelations: Observable<string[]>;
  relations: string[] = [];
  allRelations: string[] = ['r_isa', 'r_aff', 'r_nota', 'r_test'];

  @ViewChild('relationInput') fruitInput: ElementRef<HTMLInputElement>;

  constructor(private router: Router, private wordService: WordsService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this.filteredRelations = this.relationCtrl.valueChanges.pipe(
      startWith(null),
      map((relations: string | null) => relations ? this._filter(relations) : this.allRelations.slice())
    );

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
  }

  submitWordSearch() {
    // console.log('submit word to search : ');
    // console.log(this.nameControl.value)
    this.loading = true;

    // if (!this.selectedOrderByOption) {
    //   this.selectedOrderByOption = {'code': ''};
    //   // console.log('setting selectedOrderByOption to \'\'');
    // }

    if (this.nameControl.value) {
      if (this.relations.length !== 0) {
        this.router.navigate(['/words', 'words-search', this.nameControl.value, '/',  this.relations]);
      } else {
        this.router.navigate(['/words', 'words-search', this.nameControl.value]);
      }
      //
    //   // this.router.navigate(
    //   //   ['/words', 'words-search', this.formModel.name]
    //   //   // { queryParams: {orderBy: this.selectedOrderByOption}}
    //   //   // { queryParams: {orderBy: this.selectedOrderByOption}}
    //   // );
    }
    this.loading = false;

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our relation
    if ((value || '').trim()) {
      this.relations.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.relationCtrl.setValue(null);
  }

  remove(relation: string): void {

    const index = this.relations.indexOf(relation);
    if (index >= 0) {
      this.relations.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.relations.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.relationCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allRelations.filter(relation => relation.toLowerCase().indexOf(filterValue) === 0);
  }

}
