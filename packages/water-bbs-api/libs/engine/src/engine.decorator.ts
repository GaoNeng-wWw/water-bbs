import { Inject } from '@nestjs/common';

export const EngineKey = Symbol('engine');
export const InjectEngine = () => Inject(EngineKey);
