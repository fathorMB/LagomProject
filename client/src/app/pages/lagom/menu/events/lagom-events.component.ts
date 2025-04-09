import { Component } from '@angular/core';
import { VexPageLayoutHeaderDirective } from "../../../../../@vex/components/vex-page-layout/vex-page-layout-header.directive";
import { VexPageLayoutComponent } from "../../../../../@vex/components/vex-page-layout/vex-page-layout.component";
import { VexBreadcrumbsComponent } from "../../../../../@vex/components/vex-breadcrumbs/vex-breadcrumbs.component";

@Component({
  selector: 'lagom-events',
  standalone: true,
  imports: [VexPageLayoutHeaderDirective, VexPageLayoutComponent, VexBreadcrumbsComponent],
  templateUrl: './lagom-events.component.html',
  styleUrl: './lagom-events.component.scss'
})
export class LagomEventsComponent {

}
