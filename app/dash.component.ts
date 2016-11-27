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

    pieChartOptions =  {
        chartType: 'PieChart',
        dataTable: [
            ['Task', 'Hours per Day'],
            ['Work',     11],
            ['Eat',      2],
            ['Commute',  2],
            ['Watch TV', 2],
            ['Sleep',    7]
        ],
        options: {'title': 'Tasks'},
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
