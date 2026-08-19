import { Inject, Module } from '@nestjs/common';
import { Engine } from 'json-rules-engine';

export const EngineKey = Symbol('engin');
export const InjectEngine = () => Inject(EngineKey);

@Module({
  providers: [
    {
      provide: EngineKey,
      useValue: new Engine([]),
    },
  ],
})
export class EngineCore {}
