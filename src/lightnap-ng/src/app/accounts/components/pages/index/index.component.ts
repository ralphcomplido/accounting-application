
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ApiResponseComponent, EmptyPagedResponse } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DatePickerModule } from "primeng/datepicker";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { PanelModule } from "primeng/panel";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { CheckboxModule } from "primeng/checkbox";
import { debounceTime, startWith, Subject, switchMap } from "rxjs";
import { Account } from "src/app/accounts/models/response/account";
import { AccountService } from "src/app/accounts/services/account.service";

@Component({
  standalone: true,
  templateUrl: "./index.component.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    CheckboxModule,
    ApiResponseComponent,
    PanelModule,
    TableModule,
    RouterModule,
    ButtonModule],
})
export class IndexComponent {
  pageSize = 10;

  #accountService = inject(AccountService);
  #fb = inject(FormBuilder);

  form = this.#fb.group({
      accountNumber: this.#fb.nonNullable.control<string | undefined>(undefined),
      accountType: this.#fb.nonNullable.control<string | undefined>(undefined),
      accountName: this.#fb.nonNullable.control<string | undefined>(undefined),
      createdDate: this.#fb.nonNullable.control<Date | undefined>(undefined),
      lastModifiedDate: this.#fb.nonNullable.control<Date | undefined>(undefined),
  });

  #lazyLoadEventSubject = new Subject<TableLazyLoadEvent>();
  searchResults$ = this.#lazyLoadEventSubject.pipe(
    switchMap(event =>
      this.#accountService.searchAccounts({
        ...this.form.value,
        pageSize: this.pageSize,
        pageNumber: (event.first ?? 0) / this.pageSize + 1,
      })
    ),
    // We need to bootstrap the p-table with a response to get the whole process running. We do it this way to
    // fake an empty response so we can avoid a redundant call to the API.
    startWith(new EmptyPagedResponse<Account>())
  );

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(), debounceTime(1000)).subscribe(() => {
      this.#lazyLoadEventSubject.next({ first: 0 });
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.#lazyLoadEventSubject.next(event);
  }
}
