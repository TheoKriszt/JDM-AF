import {NgModule} from '@angular/core';
import {WordsModule} from './words/words.module';
import {LoadChildren, RouterModule, Routes} from '@angular/router';
import {environment} from '../environments/environment';

// let loadChildren: LoadChildren = () => {
//   if (environment.production) {
//     return './word/word.module#WordsModule';
//   } else {
//     return WordsModule; }
// };
//
// if (environment.production) {
//   loadChildren = './word/word.module#WordsModule';
// } else {
//   loadChildren = () => WordsModule;
// }
// const routes: Routes = [
//     {
//       path: 'word',
//       loadChildren: loadChildren
//       // loadChildren: './word/word.module#WordsModule'
//     }
//   ];

@NgModule({
  imports: [RouterModule.forRoot([
      {
        path: 'word',
        // loadChildren: () => WordsModule// environment.loadChildren
        loadChildren: './words/words.module#WordsModule'
      }
    ],
    {onSameUrlNavigation: 'reload'}
    // {enableTracing: true}
    )],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule {}
