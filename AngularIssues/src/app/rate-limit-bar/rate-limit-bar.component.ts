import { Component, OnInit, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IssueService } from '@app/issue-service/issue.service';
import { RateLimit } from '@app/issue-service/rate-limit.class';

@Component({
  selector: 'ais-rate-limit-bar',
  templateUrl: './rate-limit-bar.component.html',
  styleUrls: ['./rate-limit-bar.component.scss']
})
export class RateLimitBarComponent implements OnInit {
  private limitInfo: BehaviorSubject<RateLimit>;
  private hasLimit: boolean = true;
  private limitFound: boolean = false;
  
  updateLimit(): void {
    this.issueService.getRateLimit().then((limit: RateLimit) => {
      this.hasLimit = !Number.isNaN(limit.remaining);
      this.limitFound = true;
      this.limitInfo.next(limit);
    });
  }
  
  /* ------------------------------------ */

  constructor(private issueService: IssueService) { }

  ngOnInit() {
    this.limitInfo = new BehaviorSubject<RateLimit>({
      remaining: undefined, limit: undefined, resetDate: undefined
    });
    this.updateLimit();
  }

}
