import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CLOUDINARY } from 'src/constant/constant';
import { v2 } from 'cloudinary';

require('dotenv').config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
    //  logging: "all", 
      //entities: ['**/*.entity{.ts,.js}'],
      entities: [__dirname + '/../**/*.entity.js'] ,

      migrationsTableName: 'migration',

      migrations: ['src/dbMigration/*.ts'],
      //synchronize:true,
     // cli: {
       // migrationsDir: 'src/dbMigration',
      //},

      ssl: this.isProduction(),
    };
  }

}

const configService = new ConfigService(process.env)
  .ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE'
  ]);
  
  export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: () => {
      return v2.config({
        cloud_name: 'highcoder',
        api_key: '784911186423683',
        api_secret: '9CYslgAjFjt0mgAc7R0SrjCUGd0',
      });
    },
  };

export { configService };
