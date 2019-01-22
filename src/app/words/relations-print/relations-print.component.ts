import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Relation} from '../words.service';

@Component({
  selector: 'app-relations-print',
  templateUrl: './relations-print.component.html',
  styleUrls: ['./relations-print.component.scss']
})
export class RelationsPrintComponent implements OnInit, AfterViewInit {

  @Input()
  allRelations: Relation[];
  dataSource: MatTableDataSource<Relation>;
  displayedColumns: string[] = ['text', 'weight'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor() {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.allRelations);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // console.log(this.sort);
  }
}
