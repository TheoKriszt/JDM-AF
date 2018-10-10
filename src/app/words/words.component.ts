import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {WordsService} from './words.service';


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



  constructor(private router: Router, private wordService: WordsService) { }

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
      this.router.navigate(['/words', 'words-search', this.nameControl.value]);
    //
    //   // this.router.navigate(
    //   //   ['/words', 'words-search', this.formModel.name]
    //   //   // { queryParams: {orderBy: this.selectedOrderByOption}}
    //   //   // { queryParams: {orderBy: this.selectedOrderByOption}}
    //   // );
    }
    this.loading = false;

  }

  private _filter(name: string): string[] {
    return this.options;
    // return [];
  }


}
