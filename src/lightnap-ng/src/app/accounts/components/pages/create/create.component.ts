
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { BlockUiService, ErrorListComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { finalize } from "rxjs";
import { CreateAccountRequest } from "src/app/accounts/models/request/create-account-request";
import { AccountService } from "src/app/accounts/services/account.service";

@Component({
  standalone: true,
  templateUrl: "./create.component.html",
  imports: [
    CommonModule,
    CardModule,
    ReactiveFormsModule,
    RouterLink,
    DatePickerModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ErrorListComponent,
  ],
})
export class CreateComponent {
  #accountService = inject(AccountService);
  #router = inject(Router);
  #activeRoute = inject(ActivatedRoute);
  #fb = inject(FormBuilder);
  #blockUi = inject(BlockUiService);

  errors = new Array<string>();

  form = this.#fb.group({
	// TODO: Update these fields to match the right parameters.
	accountNumber: this.#fb.control("AccountNumber", [Validators.required]),
	accountType: this.#fb.control("AccountType", [Validators.required]),
	accountName: this.#fb.control("AccountName", [Validators.required]),
	createdDate: this.#fb.control(new Date(), [Validators.required]),
	lastModifiedDate: this.#fb.control(new Date(), [Validators.required]),
  });

  createClicked() {
    this.errors = [];

    const request = <CreateAccountRequest>this.form.value;

    this.#blockUi.show({message: "Creating..."});
    this.#accountService
      .createAccount(request)
      .pipe(finalize(() => this.#blockUi.hide()))
      .subscribe({
        next: account => this.#router.navigate([account.id], { relativeTo: this.#activeRoute.parent }),
        error: response => (this.errors = response.errorMessages),
      });
  }
}