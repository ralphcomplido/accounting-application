import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot, RouterStateSnapshot } from "@angular/router";
import { RouteAliasService } from "@core";
import { map, take } from "rxjs";
import { IdentityService } from "@core/services/identity.service";

export const loggedInGuard = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const routeAliasService = inject(RouteAliasService);
  const identityService = inject(IdentityService);

  return identityService
    .watchLoggedIn$()
    .pipe(
      take(1),
      map(isLoggedIn => {
        if (isLoggedIn) return true;
        identityService.setRedirectUrl(state.url);
        return createUrlTreeFromSnapshot(next, routeAliasService.getRoute("login"));
      })
    );
};
