
import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ApiResponseComponent, BlockUiService, ConfirmPopupComponent, ErrorListComponent, ToastService } from "@core";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { finalize, Observable, tap } from "rxjs";
import { UpdateAccountRequest } from "src/app/accounts/models/request/update-account-request";
import { Account } from "src/app/accounts/models/response/account";
import { AccountService } from "src/app/accounts/services/account.service";

@Component({
  standalone: true,
  templateUrl: "./edit.component.html",
  imports: [
    CommonModule,
    CardModule,
    ReactiveFormsModule,
    ApiResponseComponent,
    ConfirmPopupComponent,
    RouterLink,
    DatePickerModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ErrorListComponent,
  ],
})
export class EditComponent implements OnInit {
  #accountService = inject(AccountService);
  #router = inject(Router);
  #activeRoute = inject(ActivatedRoute);
  #confirmationService = inject(ConfirmationService);
  #toast = inject(ToastService);
  #fb = inject(FormBuilder);
  #blockUi = inject(BlockUiService);

  errors = new Array<string>();

  form = this.#fb.group({
	// TODO: Update these fields to match the right parameters.
	accountNumber: this.#fb.control("string", [Validators.required]),
	accountType: this.#fb.control("string", [Validators.required]),
	accountName: this.#fb.control("string", [Validators.required]),
		createdDate: this.#fb.control(new Date(), [Validators.required]),
		lastModifiedDate: this.#fb.control(new Date(), [Validators.required]),
  });

  readonly id = input.required<number>();
  account$ = new Observable<Account>();

  ngOnInit() {
    this.account$ = this.#accountService.getAccount(this.id()).pipe(
      tap(account => this.form.patchValue(account))
    );
  }

  saveClicked() {
    this.errors = [];

    const request = <UpdateAccountRequest>this.form.value;

    this.#blockUi.show({ message: "Saving..." });
    this.#accountService
      .updateAccount(this.id(), request)
      .pipe(finalize(() => this.#blockUi.hide()))
      .subscribe({
        next: () => this.#toast.success("Updated successfully"),
        error: response => (this.errors = response.errorMessages),
      });
  }
  
  deleteClicked(event: any) {
    this.errors = [];

    this.#confirmationService.confirm({
      header: "Confirm Delete Item",
      message: `Are you sure that you want to delete this item?`,
      target: event.target,
      key: "delete",
      accept: () => {
        this.#blockUi.show({ message: "Deleting..." });
        this.#accountService.deleteAccount(this.id())
          .pipe(finalize(() => this.#blockUi.hide()))
          .subscribe({
            next: () => {
              this.#toast.success("Deleted successfully");
              this.#router.navigate(["."], { relativeTo: this.#activeRoute.parent });
            },
            error: response => this.errors = response.errorMessages
          });
      },
    });
  }
}