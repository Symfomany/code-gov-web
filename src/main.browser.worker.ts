/*
 * Angular bootstraping
 */
import { platformWorkerAppDynamic } from '@angular/platform-webworker-dynamic';
import { decorateModuleRef } from './app/environment';
import { ApplicationRef } from '@angular/core';
import { bootloader } from '@angularclass/hmr';
import './polyfills.browser';

/*
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from './app';

/*
 * Bootstrap our Angular app with a top level NgModule
 */
// export function main(): Promise<any> {
  // return
  platformWorkerAppDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .then((v) => {console.log('bootstrapped!', v)})
    .catch(err => console.error(err));

// }


// bootloader(main);
