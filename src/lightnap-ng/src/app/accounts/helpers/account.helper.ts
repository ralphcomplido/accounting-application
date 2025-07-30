
import { Account } from "../models/response/account";

export class AccountHelper {
  static rehydrate(account: Account) {
    if (!account) return;

    if (account.createdDate) {
      account.createdDate = new Date(account.createdDate);
    }
    if (account.lastModifiedDate) {
      account.lastModifiedDate = new Date(account.lastModifiedDate);
    }
  }
}
