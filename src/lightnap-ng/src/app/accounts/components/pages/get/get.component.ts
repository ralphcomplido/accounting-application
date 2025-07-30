
import { CommonModule } from "@angular/common";
import { Component, effect, inject, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponseComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Observable } from "rxjs";
import { Account } from "src/app/accounts/models/response/account";
import { AccountService } from "src/app/accounts/services/account.service";

@Component({
  standalone: true,
  templateUrl: "./get.component.html",
  imports: [CommonModule, CardModule, RouterLink, ApiResponseComponent, ButtonModule],
})
export class GetComponent {
  #accountService = inject(AccountService);
  errors = new Array<string>();

  readonly id = input.required<number>();
  account$ = new Observable<Account>();

  constructor() {
    effect(() => this.account$ = this.#accountService.getAccount(this.id()));
  }
}
