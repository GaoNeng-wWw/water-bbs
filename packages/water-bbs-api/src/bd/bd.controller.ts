import { Controller } from '@nestjs/common';
import { BdService } from './bd.service';

@Controller('bd')
export class BdController {
  constructor(private readonly bdService: BdService) {}
}
