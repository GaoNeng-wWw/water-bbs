/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Global, Module } from '@nestjs/common';
import { ConfigureService } from './configure.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { readFileSync } from 'fs';
import { schema } from './configrue';

const loader = () => {
  return JSON.parse(
    readFileSync(join(__dirname, 'configs/config.json')).toString(),
  );
};

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loader],
      validationSchema: schema,
      isGlobal: true,
    }),
  ],
  providers: [ConfigureService],
  exports: [ConfigureService],
})
export class ConfigureModule {}
