import {Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
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
  checked = false;

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
    this.router.events.subscribe((value) => {
      if ( value instanceof RouterEvent) {
        // console.log(value);
        // console.log('value : ', value.url);
        let url: string = decodeURI(value.url);
        // console.log('url decoded : ', url);
        url = url.substring(url.lastIndexOf('/') + 1);
        const lastIndex = url.indexOf('?');
        if ( lastIndex > 0 ) {
          url = url.substring(0, (lastIndex ));
        }
        this.nameControl.setValue(decodeURIComponent(url));
      }
    });

    this.route.queryParams.subscribe(params => {
      // console.log('pipe params : ', params);
      if ( !params.types ) {
        // console.log('params types', params.types);
        console.log('relations', this.relations);
        for (let i = this.relations.length; i > 0; i--) {
          // console.error('index :: ' + (i - 1));
          this.remove(this.relations[i - 1]);
        }
      }
    });


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
      }
      // console.log('allRelations : ' , JSON.stringify(data));
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
      this.router.navigate(['/word', 'word-search', this.nameControl.value], {queryParams: params});
    }
    this.loading = false;

  }

  add(event: MatChipInputEvent): void {
    this.relationCtrl.setValue(null);
  }

  remove(relation: Type): void {
    // console.log('removing ', JSON.stringify(relation));
    const index = this.relations.indexOf(relation);
    if (index >= 0) {
      this.relations.splice(index, 1);
      let insertAt = 0;
      while (this.allRelations[insertAt].id < relation.id) {
        insertAt++;
      }
      this.allRelations.splice(insertAt, 0, relation);
    }
    this.sendRelations = [];
    for (const type of this.relations) {
      this.sendRelations.push(type.name);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value: Type = this.allRelations.filter(function(relation) {
      return relation.name === event.option.viewValue;
    })[0];

    this.relations.push(value);
    this.sendRelations.push(value.name);
    this.allRelations.splice(this.allRelations.indexOf(value), 1);

    this.relationInput.nativeElement.value = '';
    this.relationCtrl.setValue(null);
  }

}
