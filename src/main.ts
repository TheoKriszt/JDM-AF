import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  console.log('running in production');
  enableProdMode();
} else {
  console.log('running in dev');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

