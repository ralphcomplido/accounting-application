import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { AppMenuItemComponent } from "../app-menu-item/app-menu-item.component";
import { LayoutService } from "@core/layout/services/layout.service";
import { MenuService } from "@core/layout/services/menu.service";

@Component({
  selector: "app-menu",
  standalone: true,
  templateUrl: "./app-menu.component.html",
  imports: [CommonModule, AppMenuItemComponent],
})
export class AppMenuComponent {
  readonly layoutService = inject(LayoutService);
  readonly #menuService = inject(MenuService);

  readonly menuItems$ = this.#menuService.watchMenuItems$();
}
