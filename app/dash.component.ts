import { Component, OnInit, OnDestroy }  from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SummaryService }       from './summary.service';

@Component({
  selector: 'dash',
  templateUrl: 'app/dash.component.html',
  styleUrls: ['app/dash.component.css']

})

export class DashComponent implements OnInit {

    public line_ChartData = [
        ['Date', 'CO2e'],
        ['2016-11-20',  265.15],
        ['2016-11-21',  259.11],
        ['2016-11-22',  248.59],
        ['2016-11-23',  256.1],
        ['2016-11-24',  242.36],
        ['2016-11-25',  240.5],
        ['2016-11-26',  236.12]];

    public line_ChartOptions = {
        title: 'Last 7 Days CO2e',
        curveType: 'function',
        legend: { position: 'bottom'
        }
    };

  private subscription: Subscription;
  private code: string;
  
  private summary: string;
  private name: string;
  private userId: string;
  private summaryType: number;

  constructor(private summaryService: SummaryService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // subscribe to router event
    this.subscription = this.activatedRoute.queryParams.subscribe(
        (param: any) => {
          this.code = param['code'];

          localStorage.setItem('id_token', this.code);

          this.summaryService.getSummary(this.code)
              .then(response => {
                  this.name = 'Hello ' + response.name + ',';
                  this.summary = response.message;
                  this.summaryType = response.summaryType;
                  this.userId = response.userId;


                  //TODO: add chart here with fake data

              });
        });
  }

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

  pinEntered() {
      this.summaryService.authMoves(this.userId)
        .then(response => {
           this.summary = response.message;
           this.summaryType = response.summaryType;
        });
  }

};
