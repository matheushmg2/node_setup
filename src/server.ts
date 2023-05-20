import './util/module-alias';
import 'dotenv/config';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import cors from 'cors';
import * as database from '~src/database/database';
import { UserController } from './controllers/UserController';
import { ImageController } from './controllers/ImageController';

export class SetupServer extends Server {
  constructor(private port = process.env.PORT) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupController();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(
      cors({
        origin: '*',
      })
    );
  }

  private setupController(): void {
    const userController = new UserController();
    const imageController = new ImageController();
    this.addControllers([userController, imageController]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info('Server listening on port: ' + this.port);
    });
  }
}
