import { Component, OnInit, OnDestroy }  from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SummaryService }       from './summary.service';
import { LoadingPage } from './loading-container';
import * as moment from 'moment/moment';

@Component({
  selector: 'dash',
  templateUrl: 'app/dash.component.html',
  styleUrls: ['app/dash.component.css']
})

export class DashComponent extends LoadingPage implements OnInit {

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

    public bar_ChartData = [
        ['Metric', 'Value',],
        ['Current week total so far', 0],
        ['Last week total', 0]
    ];

    public bar_ChartOptions = {
        title: 'Weekly view',
        chartArea: {width: '60%'},
        hAxis: {
            title: 'CO2e Consumption',
            minValue: 0
        }
    };

  private subscription: Subscription;
  private code: string;
  
  private summary: string;
  private name: string;
  private userId: string;
  private summaryType: number;
  private movesData = [];

  constructor(private summaryService: SummaryService,
              private activatedRoute: ActivatedRoute) {

      super(true); // sets loading spinner to true
  }

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

                  // if not fetching data to display, exit
                  if (response.summaryType != 1 ) {
                      this.ready(); // sets loading spinner to false
                      return;
                  }


                  // daily average area chart -->

                  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                  var startOfWeekMoment = moment().startOf('isoWeek');
                  var endOfWeekMoment   = moment().endOf('isoWeek');
                  var currentWeekTotal = 0;

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

                      if (startOfWeekMoment.isBefore(date) && endOfWeekMoment.isAfter(date)) {
                          currentWeekTotal = currentWeekTotal + entry['co2E'];
                      }
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

                  // weekly average progress bar -->

                  var now = moment().format('ddd MMM DD, YYYY');
                  var startOfWeek = startOfWeekMoment.format('ddd MMM DD, YYYY');
                  var endOfWeek = endOfWeekMoment.format('ddd MMM DD, YYYY');

                  var lastWeekTotal = response.movesLastWeekCo2e;
                  this.bar_ChartData = [
                      ['Metric', 'Value',],
                      ['Current week total so far', currentWeekTotal],
                      ['Last week total', lastWeekTotal]
                  ];

                  this.isDataAvailable = true;
                  this.ready(); // sets loading spinner to false
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
