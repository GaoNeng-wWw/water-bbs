import { Result } from "types-ddd";
import { Account } from "../ar/account";

export interface IAccountRepoistory {
    upsert(account: Account): Result<never, >
}