import {NgModule} from '@angular/core';
import {WordsModule} from './words/words.module';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: 'words',
    loadChildren: () => WordsModule
    // loadChildren: './words/words.module#WordsModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    // {enableTracing: true}
    )],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule {}
