import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeIt)

//Trigger FE pipeline20

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers, 
    { provide: LOCALE_ID, useValue: 'it' }  // Set Italian locale
  ]
});
