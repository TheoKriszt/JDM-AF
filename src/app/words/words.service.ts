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

  searchWord(word: string, sortMode: number= 0): Observable<any> {
    const uri = this.baseUrl + '/search/word/' + word + '/' + sortMode;
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
/*
  sortRelation(checked, relations) {
    console.log('On tente le tri...');
    if (checked) { // tri par lexico
      console.log('lexico  ! ');
      for (const rIn in relations.relationIn) {
        if (relations.relationIn[rIn].values !== undefined) {
          relations.relationIn[rIn].values.sort(function (a: Relation, b: Relation) {
            return a.ted.toString().localeCompare(b.ted.toString());
          });
        }
      }
      for (const rOut in relations.relationOut) {
        if (relations.relationIn[rOut].values !== undefined) {
          relations.relationOut[rOut].values.sort(function (a, b) {
            return a.ted.localeCompare(b.ted);
          });
        }
      }
    } else { // tri par poids
      console.log('poids ! ');
      for (const rIn in relations.relationIn) {
        if (relations.relationIn[rIn].values !== undefined) {
          relations.relationIn[rIn].values.sort(function (a, b) {
            return parseInt(a.weight, 10) - parseInt(b.weight, 10);
          });
        }
      }
      for (const rOut in relations.relationOut) {
        if (relations.relationIn[rOut].values !== undefined) {
          relations.relationOut[rOut].values.sort(function (a, b) {
            return parseInt(a.weight, 10) - parseInt(b.weight, 10);
          });
        }
      }
    }
  }
*/

  // sortByLexico(array): string[] {
  //   if (array !== undefined) {
  //     array.sort(function (a, b) {
  //       return a.localeCompare(b);
  //     });
  //   }
  //   return array;
  // }

  sortByWeight(relations) {
    for (const rIn in relations.relationIn) {
      if (relations.relationIn[rIn].values !== undefined) {
        relations.relationIn[rIn].values.sort(function (a, b) {
          return parseInt(a.weight, 10) - parseInt(b.weight, 10);
        });
      }
    }
    for (const rOut in relations.relationOut) {
      if (relations.relationIn[rOut].values !== undefined) {
        relations.relationOut[rOut].values.sort(function (a, b) {
          return parseInt(a.weight, 10) - parseInt(b.weight, 10);
        });
      }
    }
  }

  getRelationsTypes() {
    const uri = this.baseUrl + '/relations/relationTypes';

    if (this.relationsTypes !== undefined) {
      return this.relationsTypes;
      // console.log('J\'passe la ');
    } else {
      this.relationsTypes = this.http.get<RelationTypes>(uri);
      // console.log('j\'passe ici');
      return this.relationsTypes;
    }

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
  tid: 0;
  ted: '';
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
