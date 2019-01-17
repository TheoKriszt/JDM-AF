import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Relation} from '../words.service';
import {PageEvent} from '@angular/material/typings/esm5/paginator';

@Component({
  selector: 'app-relations-print',
  templateUrl: './relations-print.component.html',
  styleUrls: ['./relations-print.component.scss']
})
export class RelationsPrintComponent implements OnInit, OnChanges {

  @Input()
  relations: MatTableDataSource<Relation>;
  displayedColumns: string[] = ['nom', 'poids'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  length = 1000; // nombre d'éléments
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];

  // MatPaginator Output
  pageEvent: PageEvent;

  activePageDataChunk = [];
  datasource = [];

  constructor() {
    this.relations = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.relations.paginator = this.paginator;
    this.relations.sort = this.sort;


    // console.log('Relations a afficher : ', this.relations);
  }

  public paginatorChanged(event?: PageEvent) {

    // console.log('Paginator event : ', event);
    this.pageSize = event.pageSize;
    const firstPage = event.pageIndex * this.pageSize;
    const lastPage = firstPage + this.pageSize;
    // lastPage = Math.min(, Math.floor(this.datasource.length / this.pageSize)); ;
    // console.log('elements ' + firstPage + ' / ' + lastPage);
    this.activePageDataChunk = this.datasource.slice(firstPage, lastPage);
  }


  sortData(event: any) {
    // console.log('sort Data : ', event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes : ', changes.relations.currentValue.length);
    this.datasource = changes.relations.currentValue;
    this.length = changes.relations.currentValue.length;
    this.activePageDataChunk = this.datasource.slice(0, this.pageSize);
  }
}
