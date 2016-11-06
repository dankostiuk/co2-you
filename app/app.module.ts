import { NgModule }            from '@angular/core';
import { BrowserModule  }      from '@angular/platform-browser';
import { AUTH_PROVIDERS }      from 'angular2-jwt';
import { SummaryService }        from './summary.service';

import { AppComponent }        from './app.component';
import { HomeComponent }       from './home.component';
import { DashComponent }       from './dash.component';
import { routing,
         appRoutingProviders } from './app.routes';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        DashComponent
    ],
    providers:    [
        SummaryService,
        appRoutingProviders,
        AUTH_PROVIDERS,
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    imports:      [
        BrowserModule,
        routing
    ],
    bootstrap:    [AppComponent],
})
export class AppModule {}
