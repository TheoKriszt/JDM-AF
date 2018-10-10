import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationsSearchComponent } from './relations-search.component';

describe('RelationsSearchComponent', () => {
  let component: RelationsSearchComponent;
  let fixture: ComponentFixture<RelationsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
