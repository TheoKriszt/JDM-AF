import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsSearchComponent } from './words-search.component';

describe('WordsSearchComponent', () => {
  let component: WordsSearchComponent;
  let fixture: ComponentFixture<WordsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
