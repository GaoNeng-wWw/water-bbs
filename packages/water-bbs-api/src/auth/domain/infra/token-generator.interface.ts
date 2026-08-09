export type GenratorProps<AdditionalData extends Record<string, any>> = {
  sessionId: string;
  sub: string;
  /**
   * @description seconds
   */
  ttl: number;
} & AdditionalData;

export abstract class TokenGenrator {
  abstract generator<AdditionalData extends Record<string, any>>(
    props: GenratorProps<AdditionalData>,
  ): Promise<string>;
}
