import { Component } from '@angular/core';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  repoPath: string;
  ngOnInit() {
    this.repoPath = environment.repoOwner +'/'+ environment.repoName;
  }
}
