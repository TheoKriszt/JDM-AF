import {Injectable, isDevMode} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Headers} from '@angular/http';
import { environment } from '../../environments/environment';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordsService {

  private readonly JSON_HEADER = new Headers({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl + ':' + environment.apiPort;
  resultRelations: Relation[] = [];
  /**
   * Demande l'autocompletion d'un terme de recherche
   * @param query String de recherche, possible d'y insérer des caractères joker (?,* etc)
   */
  autocomplete(query: String): Observable <string[]> {
    const uri = this.baseUrl + '/autocomplete/' + query;
    return this.http.get(uri) as Observable <string[]>;
  }

  searchWord(word: string): Observable<any> {
    const uri = this.baseUrl + '/search/word/' + word;
    return this.http.get<Word>(uri);
  }

  getAllRelations(wordId: string, types: string[], rIn: boolean, rOut: boolean): Observable<any> {
    
    let params = {
      relationTypes: types,
      wantIn : rIn,
      wantOut : rOut,  
    }
    
    return this.http.post(this.baseUrl + 'searc/relation/' + wordId, params , this.JSON_HEADER);
  }

  /**
  searchRelations(word: any, relationTypes: any[]): Observable<any> {
    console.log('On passe la: searchRelations');
    for (const type in relationTypes) {
      for (const rIn in word.relationIn) {
        console.log('rIn : ' + rIn);
          if (type === rIn) {
            this.resultRelations.push(rIn);
          }
      }
      for (const rOut in word.relationOut) {
        if (type === rOut) {
          this.resultRelations.push(rOut);
        }
      }
    }
    return of(this.resultRelations);

 }
   **/
}


export interface Word {
  word: {
    weight: 0,
    id: 0 ,
    type: 0,
    text: ''
  };
  'formatedWord': '';
  'definition': '';
  'relationsOut': Relation[];
  'relationsIn': Relation[];
}

export interface Relation {
  type: '';
  weight: 0;
  tid: 0;
  ted: 0;
  text: '';
}
