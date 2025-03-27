import { Component } from '@angular/core';
import { VexPageLayoutComponent } from "../../../../../@vex/components/vex-page-layout/vex-page-layout.component";
import { VexPageLayoutHeaderDirective } from "../../../../../@vex/components/vex-page-layout/vex-page-layout-header.directive";
import { VexBreadcrumbsComponent } from "../../../../../@vex/components/vex-breadcrumbs/vex-breadcrumbs.component";
import { VexPageLayoutContentDirective } from "../../../../../@vex/components/vex-page-layout/vex-page-layout-content.directive";
import { MatTabsModule } from '@angular/material/tabs';
import { PageLayoutDemoComponent } from "../../../ui/page-layouts/page-layout-demo/page-layout-demo.component";

@Component({
  selector: 'vex-warehouse',
  standalone: true,
  imports: [VexPageLayoutComponent, VexPageLayoutHeaderDirective, VexBreadcrumbsComponent, VexPageLayoutContentDirective, MatTabsModule, PageLayoutDemoComponent],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent {

}
