export class CreateAccountDTO {
    username: string;
    ident_type: string;
    ident_value: string;
    cert_type: string;
    cert_value: string;
    constructor(prop: typeof CreateAccountDTO){
        Object.assign(this, prop);
    }
}