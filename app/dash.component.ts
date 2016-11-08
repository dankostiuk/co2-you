import { Component, OnInit, OnDestroy }  from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SummaryService }       from './summary.service';

@Component({
  selector: 'dash',
  template: `<h4>Dashboard</h4>`
})

export class DashComponent implements OnInit {

  private subscription: Subscription;
  private code: string;
  
  private summary: string;

  constructor(private summaryService: SummaryService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // subscribe to router event
    this.subscription = this.activatedRoute.queryParams.subscribe(
        (param: any) => {
          this.code = param['code'];

          this.summaryService.getSummary(this.code)
              .then(response => this.summary = response);
        });
  }

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

};
