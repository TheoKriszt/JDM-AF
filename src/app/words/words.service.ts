import {Injectable, isDevMode} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordsService {


  private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl + ':' + environment.apiPort;
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
    const params = {
      relationTypes: types,
      wantIn : rIn,
      wantOut : rOut,
    };

    return this.http.post(this.baseUrl + '/search/relation/' + wordId, params , this._options);
  }
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
