import {Injectable, isDevMode} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Headers} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WordsService {

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
    return this.http.get(uri);
  }
}
