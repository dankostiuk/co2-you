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

    public area_ChartData = [['Date', 'Daily CO2e', 'Daily Average'], ['',0,0]];

    public area_ChartOptions = {
        title: 'Last 7 Days CO2e',
        lineWidth: 5,
        pointSize: 10,
        legend: {
            position: 'right'
        },
        animation: {
            startup: 'true',
            duration: 10
        },
        backgroundColor: {
            fill: '#ffffff'
        },
        fontName: 'sans-serif',
        series: [
            {color: '#79c02b', visibleInLegend: false},
            {color: '#ff9900', areaOpacity: 0, labelInLegend: 'Daily Avg.', pointsVisible: false, lineDashStyle: [5,4]}
        ]
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

    private isDataAvailable:boolean = false;


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
                  var data: number[]=[];
                  var dailyAvg = response.movesDailyAverageCo2e;

                  for (let entry of response.movesData) {
                      var date = new Date(entry['timestamp']);
                      var month = months[(date.getMonth())];
                      var day = date.getDate();
                      var year = date.getFullYear();

                      dates.push(month + ' ' + day + ', ' + year);
                      data.push(entry['co2E']);
                  }

                  this.area_ChartData = [
                      ['Date', 'Daily CO2e', 'Daily Average'],
                      [dates[0],  data[0], dailyAvg],
                      [dates[1],  data[1], dailyAvg],
                      [dates[2],  data[2], dailyAvg],
                      [dates[3],  data[3], dailyAvg],
                      [dates[4],  data[4], dailyAvg],
                      [dates[5],  data[5], dailyAvg],
                      [dates[6],  data[6], dailyAvg]];

                  this.isDataAvailable = true;

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
