import { InfrastructureError } from 'water-bbs-shared';

export class FeaturesLoaderError extends InfrastructureError {
  constructor(child: Error | null = null, args: Record<string, any> = {}) {
    super('FEATURE_LOAD_ERROR', child, args);
  }
}
export class FeatureParseError extends InfrastructureError {
  constructor(child: Error | null = null, args: Record<string, any> = {}) {
    super('FEATURE_PARSE_ERROR', child, args);
  }
}
