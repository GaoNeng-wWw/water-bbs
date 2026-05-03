import { Controller } from '@nestjs/common';
import { AccountService } from './application';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
}
