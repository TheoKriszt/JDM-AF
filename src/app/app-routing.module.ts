import {NgModule} from '@angular/core';
import {WordsModule} from './words/words.module';
import {RouterModule, Routes} from '@angular/router';
import {environment} from '../environments/environment';


let routes: Routes;

if (environment.production) {
  routes = [
      {
        path: 'words',
        // loadChildren: () => WordsModule
        loadChildren: './words/words.module#WordsModule'
      }
    ];
} else {
  routes = [
    {
      path: 'words',
      loadChildren: () => WordsModule
      // loadChildren: './words/words.module#WordsModule'
    }
  ];
}

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {onSameUrlNavigation: 'reload'}
    // {enableTracing: true}
    )],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule {}
