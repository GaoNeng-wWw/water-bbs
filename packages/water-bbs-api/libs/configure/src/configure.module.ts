/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ConfigurableModuleBuilder,
  DynamicModule,
  Global,
  Module,
} from '@nestjs/common';
import { ConfigureService } from './configure.service';
import { ConfigModule } from '@nestjs/config';
import { readFileSync } from 'fs';
import { schema } from './configrue';

const loader = (path: string) => {
  return JSON.parse(readFileSync(path).toString());
};
export type ConfigureModuleProps = {
  path: string;
  global?: boolean;
};

export const { ConfigurableModuleClass } =
  new ConfigurableModuleBuilder<ConfigureModuleProps>()
    .setExtras({ global: true })
    .build();

@Global()
@Module({
  imports: [ConfigModule],
  providers: [ConfigureService],
  exports: [ConfigureService],
})
export class ConfigureModule extends ConfigurableModuleClass {
  constructor() {
    super();
  }

  static register(props: ConfigureModuleProps): DynamicModule {
    return {
      imports: [
        ConfigModule.forRoot({
          load: [() => loader(props.path)],
          isGlobal: props.global,
          validationSchema: schema,
        }),
      ],
      providers: [ConfigureService],
      exports: [ConfigureService],
      module: ConfigureModule,
    };
  }
}
