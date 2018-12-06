import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationsPrintComponent } from './relations-print.component';

describe('RelationsPrintComponent', () => {
  let component: RelationsPrintComponent;
  let fixture: ComponentFixture<RelationsPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationsPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
