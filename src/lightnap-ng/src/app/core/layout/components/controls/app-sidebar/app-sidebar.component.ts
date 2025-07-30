import { Component } from "@angular/core";
import { AppMenuComponent } from "../app-menu/app-menu.component";

@Component({
  selector: "app-sidebar",
  templateUrl: "./app-sidebar.component.html",
  imports: [AppMenuComponent],
})
export class AppSidebarComponent {}
