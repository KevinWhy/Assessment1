import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { IssueService } from '@app/issue-service/issue.service';
import { RateLimit } from '@app/issue-service/rate-limit.class';

type LimitDisplayType =
  "UnknownLimit" | "NoLimit" | "InsideLimit" | "ExceededLimit";

@Component({
  selector: 'ais-rate-limit-bar',
  templateUrl: './rate-limit-bar.component.html',
  styleUrls: ['./rate-limit-bar.component.scss']
})
export class RateLimitBarComponent {
  displayType: LimitDisplayType = "UnknownLimit";
  limitResetDateStr:  string = "";
  get limitInfo(): Observable<RateLimit> {  return this.issueService.limitInfo;  }
  
  constructor(private issueService: IssueService) {
    // Every time limit updates, also update component's variables
    this.limitInfo.subscribe((newInfo: RateLimit) => {
      if (newInfo.remaining === undefined) {
        this.displayType = "UnknownLimit";
        this.limitResetDateStr = "Unknown";
        
      } else {
        this.limitResetDateStr = newInfo.resetDate.toLocaleDateString()
          + " " +newInfo.resetDate.toLocaleTimeString();
        
        if (Number.isNaN(newInfo.remaining)) {
          this.displayType = "NoLimit";
        } else if (newInfo.remaining > 0) {
          this.displayType = "InsideLimit";
        } else {
          this.displayType = "ExceededLimit";
        }
      }
    });
  }

}
