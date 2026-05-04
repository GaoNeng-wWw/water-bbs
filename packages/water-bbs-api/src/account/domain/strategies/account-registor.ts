import { Profile } from "water-bbs-migration";
import { DomainError, Result } from "water-bbs-shared";

export type RegistorProp = {
    ident_type: string;
    ident_value: string;
    cert_type: string;
    cert_value: string;
    profile: Profile
}

export interface AccountRegistor {
    valid(ident_type: string): boolean;
    execute(prop: RegistorProp): Promise<Result<boolean, DomainError>>;
}