import { repl } from '@nestjs/core';
import { AppModule } from './src/app.module';

async function bootstrap() {
  await repl(AppModule, {
    breakEvalOnSigint: true,
  });
}
bootstrap();
