import {NgModule} from '@angular/core';
import {WordsModule} from './words/words.module';
import {LoadChildren, RouterModule, Routes} from '@angular/router';
import {environment} from '../environments/environment';

let loadChildren: LoadChildren;

if (environment.production) {
  loadChildren = './word/word.module#WordsModule';
} else {
  loadChildren = () => WordsModule;
}

const routes: Routes = [
    {
      path: 'word',
      loadChildren: loadChildren
      // loadChildren: './word/word.module#WordsModule'
    }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {onSameUrlNavigation: 'reload'}
    // {enableTracing: true}
    )],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule {}
