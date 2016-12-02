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
        [this.movesDate[0],  this.movesData[0]],
        [this.movesDate[1],  this.movesData[1]],
        [this.movesDate[2],  this.movesData[2]],
        [this.movesDate[3],  this.movesData[3]],
        [this.movesDate[4],  this.movesData[4]],
        [this.movesDate[5],  this.movesData[5]],
        [this.movesDate[6],  this.movesData[6]]];

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

  private movesDate: string[]=['','','','','','',''];
  private movesData: number[]=[0,0,0,0,0,0,0];

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

                  for (let entry of response.movesData) {
                      var date = new Date(entry['timestamp']);
                      var month = months[(date.getMonth())];
                      var day = date.getDate();
                      var year = date.getFullYear();

                      this.movesDate.push(month + ' ' + day + ', ' + year);
                      this.movesData.push(entry['co2E']);
                  }
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
