
import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API_URL_ROOT, PagedResponseDto } from "@core";
import { tap } from "rxjs";
import {AccountHelper } from "../helpers/account.helper";
import { CreateAccountRequest } from "../models/request/create-account-request";
import { SearchAccountsRequest } from "../models/request/search-accounts-request";
import { UpdateAccountRequest } from "../models/request/update-account-request";
import { Account } from "../models/response/account";

@Injectable({
  providedIn: "root",
})
export class DataService {
  #http = inject(HttpClient);
  #apiUrlRoot = `${inject(API_URL_ROOT)}Accounts/`;

  getAccount(id: number) {
    return this.#http.get<Account>(`${this.#apiUrlRoot}${id}`).pipe(
      tap(account => AccountHelper.rehydrate(account))
      );
  }

  searchAccounts(request: SearchAccountsRequest) {
    return this.#http.post<PagedResponseDto<Account>>(`${this.#apiUrlRoot}search`, request).pipe(
      tap(results => results.data.forEach(AccountHelper.rehydrate))
    );
  }

  createAccount(request: CreateAccountRequest) {
    return this.#http.post<Account>(`${this.#apiUrlRoot}`, request);
  }

  updateAccount(id: number, request: UpdateAccountRequest) {
    return this.#http.put<Account>(`${this.#apiUrlRoot}${id}`, request);
  }

  deleteAccount(id: number) {
    return this.#http.delete<boolean>(`${this.#apiUrlRoot}${id}`);
  }
}
