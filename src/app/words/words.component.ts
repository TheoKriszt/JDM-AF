import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css']
})
export class WordsComponent implements OnInit {
  loading = false;

  formModel = new FormGroup({
    name: new FormControl(''),
  });

  autocomplete_options = [];

  orderByOptions: [
    {name: 'Nom', code: 'name'},
    {name: 'Poids', code: 'weight'}
  ];

  selectedOrderByOption: any;

  constructor(private router: Router) { }

  ngOnInit() {
    // pré-remplir le formulaire
    //this.formModel.setValue({name: 'chien'});
    this.autocomplete_options = ['Chat', 'Chien', 'Arbre', 'Singe', 'Cookie'];
  }

  submitWordSearch() {
    this.loading = true;

    if (!this.selectedOrderByOption) {
      this.selectedOrderByOption = {'code': ''};
      // console.log('setting selectedOrderByOption to \'\'');
    }

    if (this.formModel.get('name').value) {
      console.log('name  : ' + this.formModel.get('name').value);
      this.loading = false;
      this.router.navigate(['/words', 'words-search', this.formModel.get('name').value]);

      // this.router.navigate(
      //   ['/words', 'words-search', this.formModel.name]
      //   // { queryParams: {orderBy: this.selectedOrderByOption}}
      //   // { queryParams: {orderBy: this.selectedOrderByOption}}
      // );
    }
  }

}
