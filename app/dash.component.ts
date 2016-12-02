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

    public line_ChartData = [['Date', 'Daily CO2e'], []];

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
                  var data: number[]=[];

                  for (let entry of response.movesData) {
                      var date = new Date(entry['timestamp']);
                      var month = months[(date.getMonth())];
                      var day = date.getDate();
                      var year = date.getFullYear();

                      dates.push(month + ' ' + day + ', ' + year);
                      data.push(entry['co2E']);
                  }

                  this.line_ChartData = [
                      ['Date', 'Daily CO2e'],
                      [dates[0],  data[0]],
                      [dates[1],  data[1]],
                      [dates[2],  data[2]],
                      [dates[3],  data[3]],
                      [dates[4],  data[4]],
                      [dates[5],  data[5]],
                      [dates[6],  data[6]]];

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
