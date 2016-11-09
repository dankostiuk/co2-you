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

  private subscription: Subscription;
  private code: string;
  
  private summary: string;
  private name: string;

  constructor(private summaryService: SummaryService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // subscribe to router event
    this.subscription = this.activatedRoute.queryParams.subscribe(
        (param: any) => {
          this.code = param['code'];

          this.summaryService.getSummary(this.code)
              .then(response => {
                  this.name = response.name;
                  if (response.summaryType == 1) {
                      this.summary = '2 week CO2e: ' + response.message;
                  } else if (response.summaryType == 2) {
                      this.summary = response.message;
                  }
              });
        });
  }

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

};
