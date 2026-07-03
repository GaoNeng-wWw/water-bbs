import { Global, Module } from '@nestjs/common';
import { Engine } from 'json-rules-engine';

@Global()
@Module({
  providers: [{ provide: 'ENGINE', useValue: new Engine() }],
  exports: ['ENGINE'],
})
export class EngineModule {}
