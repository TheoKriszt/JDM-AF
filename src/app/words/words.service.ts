import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WordsService {


  private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  private relationsTypes;

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl + ':' + environment.apiPort;
  /**
   * Demande l'autocompletion d'un terme de recherche
   * @param query String de recherche, possible d'y insérer des caractères joker (?,* etc)
   */
  autocomplete(query: String): Observable <string[]> {
    const uri = this.baseUrl + '/autocomplete/' + query;
    // res = this.http.get(uri) as Observable <string[]>;

    return this.http.get(uri) as Observable <string[]>;
  }

  searchWord(word: string): Observable<any> {
    const uri = this.baseUrl + '/search/word/' + word;
    return this.http.get<Word>(uri);
  }

  getAllRelations(wordId: string, types: string[], rIn: boolean, rOut: boolean, sortChecked: boolean): Observable<any> {
    const params = {
      relationTypes: types,
      wantIn : rIn,
      wantOut : rOut,
      wantSort : sortChecked
    };

    return this.http.post(this.baseUrl + '/search/relation/' + wordId, params , this._options);
  }

  getRelationsTypes(): Observable<RelationTypes> {
    const uri = this.baseUrl + '/relations/relationTypes';

    if (this.relationsTypes !== undefined) {
      return this.relationsTypes;
    } else {
      this.relationsTypes = this.http.get<RelationTypes>(uri);
      return this.relationsTypes;
    }
  }

  getImageFor(searchedWord: string) {
    return this.baseUrl + '/imagesearch/' + searchedWord;
  }
}

export interface Word {
  'id': 0;
  'formatedWord': '';
  'definitions': string[];
  'relationsOut':
    [{
      'relationType': '',
      'values': Relation[]
    }];
  'relationsIn':
    [{
      'relationType': '',
      'values': Relation[]
    }];
}

export interface Relation {
  type: '';
  weight: 0;
  text: '';
}

export class Type {
  id: 0;
  name: string;
  definition: string;
}

export interface RelationTypes {
  types: Type[];
}
