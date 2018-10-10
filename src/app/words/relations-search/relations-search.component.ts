import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatChipInputEvent} from '@angular/material';
import {MatAutocompleteSelectedEvent} from '@angular/material/typings/autocomplete';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-relations-search',
  templateUrl: './relations-search.component.html',
  styleUrls: ['./relations-search.component.scss']
})
export class RelationsSearchComponent implements OnInit {

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

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
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
