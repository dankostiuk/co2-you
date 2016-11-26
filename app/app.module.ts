import { NgModule }            from '@angular/core';
import { BrowserModule  }      from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AUTH_PROVIDERS }      from 'angular2-jwt';
import { SummaryService }        from './summary.service';

import { AppComponent }        from './app.component';
import { HomeComponent }       from './home.component';
import { DashComponent }       from './dash.component';
import { GoogleChart }         from './../directives/angular2-google-chart.directive';
import { routing,
         appRoutingProviders } from './app.routes';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        DashComponent,
        GoogleChart
    ],
    providers:    [
        SummaryService,
        appRoutingProviders,
        AUTH_PROVIDERS
    ],
    imports:      [
        BrowserModule,
        HttpModule,
        routing
    ],
    bootstrap:    [AppComponent],
})
export class AppModule {}
