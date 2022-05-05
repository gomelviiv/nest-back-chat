import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);

    // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    // app.use(bodyParser.json({ limit: '50mb' }));
    app.enableCors({
      origin: `${process.env.API_APP}`,
      allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization ',
      methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
      credentials: true,
    });
    app.use(cookieParser());

    app.listen(PORT, () => console.log(`server started on PORT:${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
