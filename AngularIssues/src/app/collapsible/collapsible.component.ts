import { AfterContentInit, Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'ais-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss']
})
export class CollapsibleComponent implements AfterContentInit {
  @Input()
  collapsed: boolean = true;
  @Input()
  width: number;
  @Input()
  collapsedHeight: number;
  
  @ViewChild('content')
  private contentElem: any;
  canCollapse: boolean;
  
  updateCanCollapse() {
    let contentBounds = this.contentElem.nativeElement.getBoundingClientRect();
    this.canCollapse  = contentBounds.height > this.collapsedHeight;
  }
  
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
  
  /* -----------------------------------------*/
  
  constructor() { }
  
  ngAfterContentInit() {
    this.updateCanCollapse();
  }
}
