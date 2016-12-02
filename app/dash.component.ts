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
        ['Date', 'Daily CO2e'],
        ['2016-11-20',  265.15],
        ['2016-11-21',  259.11],
        ['2016-11-22',  248.59],
        ['2016-11-23',  256.1],
        ['2016-11-24',  242.36],
        ['2016-11-25',  240.5],
        ['2016-11-26',  236.12]];

    public line_ChartOptions = {
        title: 'Last 7 Days CO2e',
        lineWidth: 5,
        pointSize: 10,
        legend: {
            position: 'none'
        },
        animation: {
            startup: 'true',
            duration: 10
        },
        backgroundColor: {
            fill: '#ffffff'
        },
        colors: ['#79c02b'],
        fontName: 'sans-serif'
    };

  private subscription: Subscription;
  private code: string;
  
  private summary: string;
  private name: string;
  private userId: string;
  private summaryType: number;
  private movesData = [];

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

                  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                  var dates: string[]=[];

                  for (let entry of response.movesData) {
                      var date = new Date(entry['timestamp']);
                      var month = months[(date.getMonth())];
                      var day = date.getDate();
                      var year = date.getFullYear();

                      dates.push(year + '-' + month + '-' + day);
                  }

                  this.line_ChartData = [
                      ['Date', 'Daily CO2e'],
                      [dates[0],  response.movesData[0]['co2E']],
                      [dates[1],  response.movesData[1]['co2E']],
                      [dates[2],  response.movesData[2]['co2E']],
                      [dates[3],  response.movesData[3]['co2E']],
                      [dates[4],  response.movesData[4]['co2E']],
                      [dates[5],  response.movesData[5]['co2E']],
                      [dates[6],  response.movesData[6]['co2E']]];

                  console.log(this.line_ChartData);

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
