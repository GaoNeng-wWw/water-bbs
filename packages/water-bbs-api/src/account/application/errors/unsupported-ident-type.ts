import { AppError, ApplicationService } from "water-bbs-shared";

export class UnsupportedIdentType extends ApplicationService {
    constructor(identType: string){
        super('UNSUPPORTED_IDENT_TYPE', 400, null, {identType});
    }
}