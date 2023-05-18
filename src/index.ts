import { SetupServer } from './server';

(async (): Promise<void> => {
  try {
    const server = new SetupServer(process.env.PORT);
    await server.init();
    server.start();
  } catch (error) {
    console.log(error);
  }
})();
