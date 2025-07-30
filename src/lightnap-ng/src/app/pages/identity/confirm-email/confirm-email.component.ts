import { Component, inject, input, OnInit, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BlockUiService, ErrorListComponent } from "@core";
import { IdentityService } from "@core/services/identity.service";
import { RouteAliasService } from "@core";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { finalize } from "rxjs";
import { IdentityCardComponent } from "@core";

@Component({
  standalone: true,
  templateUrl: "./confirm-email.component.html",
  imports: [ReactiveFormsModule, RouterModule, ButtonModule, InputTextModule, CheckboxModule, IdentityCardComponent, ErrorListComponent],
})
export class ConfirmEmailComponent implements OnInit {
  #identityService = inject(IdentityService);
  #blockUi = inject(BlockUiService);
  #routeAlias = inject(RouteAliasService);

  readonly email = input("");
  readonly code = input("");

  errors = signal(new Array<string>());

  ngOnInit() {
    this.#blockUi.show({ message: "Verifying email..." });
    this.#identityService
      .verifyEmail({
        code: this.code(),
        email: this.email(),
      })
      .pipe(finalize(() => this.#blockUi.hide()))
      .subscribe({
        next: () => this.#routeAlias.navigateWithExtras("user-home", undefined, { replaceUrl: true }),
        error: response => this.errors.set(response.errorMessages),
      });
  }
}
