import { Component, OnInit }  from '@angular/core';
import { SummaryService }       from './summary.service';

@Component({
  selector: 'dash',
  template: `<h4>somehtml</h4>`
})

export class DashComponent implements OnInit {
  constructor(private summaryService: SummaryService) {}

  ngOnInit() {
    this.summaryService.getSummary()
        .then(response => response.json());
  }


};
