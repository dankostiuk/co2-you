import { NgModule }            from '@angular/core';
import { BrowserModule  }      from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AUTH_PROVIDERS }      from 'angular2-jwt';
import { SummaryService }        from './summary.service';

import { AppComponent }        from './app.component';
import { HomeComponent }       from './home.component';
import { DashComponent }       from './dash.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { routing,
         appRoutingProviders } from './app.routes';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        DashComponent
    ],
    providers:    [
        SummaryService,
        appRoutingProviders,
        AUTH_PROVIDERS
    ],
    imports:      [
        BrowserModule,
        HttpModule,
        routing,
        Ng2GoogleChartsModule
    ],
    bootstrap:    [AppComponent],
})
export class AppModule {}
