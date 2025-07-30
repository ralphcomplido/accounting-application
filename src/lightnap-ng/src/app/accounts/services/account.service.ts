
import { inject, Injectable } from "@angular/core";
import { CreateAccountRequest } from "../models/request/create-account-request";
import { SearchAccountsRequest } from "../models/request/search-accounts-request";
import { UpdateAccountRequest } from "../models/request/update-account-request";
import { DataService } from "./data.service";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  #dataService = inject(DataService);

    getAccount(id: number) {
        return this.#dataService.getAccount(id);
    }

    searchAccounts(request: SearchAccountsRequest) {
        return this.#dataService.searchAccounts(request);
    }

    createAccount(request: CreateAccountRequest) {
        return this.#dataService.createAccount(request);
    }

    updateAccount(id: number, request: UpdateAccountRequest) {
        return this.#dataService.updateAccount(id, request);
    }

    deleteAccount(id: number) {
        return this.#dataService.deleteAccount(id);
    }
}
