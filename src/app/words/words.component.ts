import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css']
})
export class WordsComponent implements OnInit {
  loading = false;
  formModel: any = {
    name: ''
  };
  orderByOptions: [
    {name: 'Nom', code: 'name'},
    {name: 'Poids', code: 'weight'}
  ];
  selectedOrderByOption: any;

  constructor(private router: Router) { }

  ngOnInit() {
    // pré-remplir le formulaire
    this.formModel.name = 'chien';
  }

  submitWordSearch() {
    this.loading = true;

    if (!this.selectedOrderByOption) {
      this.selectedOrderByOption = {'code': ''};
      // console.log('setting selectedOrderByOption to \'\'');
    }

    if (this.formModel.name) {
      console.log('name  : ' + this.formModel.name);
      this.loading = false;


      this.router.navigate(['/words', 'words-search', this.formModel.name]);

      // this.router.navigate(
      //   ['/words', 'words-search', this.formModel.name]
      //   // { queryParams: {orderBy: this.selectedOrderByOption}}
      //   // { queryParams: {orderBy: this.selectedOrderByOption}}
      // );
    }


  }

}
