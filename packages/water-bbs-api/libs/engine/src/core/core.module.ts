import { Inject } from '@nestjs/common';

export const EngineKey = Symbol('engin');
export const InjectEngine = () => Inject(EngineKey);
