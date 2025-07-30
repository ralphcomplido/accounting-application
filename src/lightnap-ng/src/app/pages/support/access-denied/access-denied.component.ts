import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { RoutePipe, ErrorApiResponse } from "@core";
import { LayoutService } from "@core/layout/services/layout.service";
import { RouteAliasService, ToastService } from "@core";
import { IdentityService } from "@core/services/identity.service";
import { ButtonModule } from "primeng/button";
import { take } from "rxjs";

@Component({
  standalone: true,
  templateUrl: "./access-denied.component.html",
  imports: [CommonModule, RouterLink, RoutePipe, ButtonModule],
})
export class AccessDeniedComponent {
  layoutService = inject(LayoutService);
  #identityService = inject(IdentityService);
  #routeAlias = inject(RouteAliasService);
  #toast = inject(ToastService);

  loggedIn$ = this.#identityService.watchLoggedIn$();

  constructor() {
    this.loggedIn$.pipe(take(1)).subscribe({
      next: loggedIn => {
        if (!loggedIn) {
          this.#routeAlias.navigate("login");
        }
      },
    });
  }

  logOut() {
    this.#identityService.logOut().subscribe({
      next: () => this.#routeAlias.navigate("login"),
      error: (response: ErrorApiResponse<any>) => response.errorMessages.forEach(error => this.#toast.error(error)),
    });
  }
}
