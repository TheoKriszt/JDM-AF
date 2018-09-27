import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-words-search',
  templateUrl: './words-search.component.html',
  styleUrls: ['./words-search.component.css']
})
export class WordsSearchComponent implements OnInit {
  private orderByParam = '';
  words: any = {};

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('words-search :: ngInit');
    // this.route.params.subscribe(routeParams => {
    //   this.route.queryParams
    //     .subscribe(params => {
    //       this.orderByParam = params.orderBy;
    //
    //
    //       // this.trajetsService.getTrajetsRecherche(searchOptions).subscribe(mongoRes => {
    //       //   this.trajets = mongoRes;
    //       // });
    //
    //     });
    // });
  }

  gotResults(): boolean {
    return (this.words[0] !== undefined);
  }

}
