import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import {  UserService } from './services/users/user.service';
import { UsersController } from './controllers/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryProvider, configService } from './config/config.service';
import { User } from './model/user.entity';
import { JwtModule } from '@nestjs/jwt/dist';
import { jwtConstants } from './constant/constant';
import { DesignTypeService } from './services/designType/designType.service';
import { DesignTypeController } from './controllers/designType/designType.controller';
import { RoomDesignService } from './services/roomDesign/roomDesign.service';
import { RoomDesignController } from './controllers/roomDesign/roomDesign.controller';
import { DesignType } from './model/designType.entity';
import { UserPrompt } from './model/userPrompt.entity';
import { UploaderService } from './services/uploader/uploader.service';
import { ImageUploader } from './model/uploader.entity';
import { HttpModule } from '@nestjs/axios';
import { AuthMiddleware } from './middleware/auth.middleware';
import { DressDesignController } from './controllers/dressDesign/dressDesign.controller';
import { DressDesignService } from './services/dressDesign/dressDesign.service';
import { ResultService } from './services/result/result.service';
import { Result } from './model/result.entity';
import { ResultController } from './controllers/results/results.controller';
import { userSessionModule } from './modules/userSession/userSession.module';
import { ColorModule } from './modules/color/color.module';
import { LazyModuleLoader } from '@nestjs/core';
import { PromptGuidModule } from './modules/promptGuid/promptGuid.module';


@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig()), 
    TypeOrmModule.forFeature([User, 
     DesignType,
     UserPrompt,
     ImageUploader,
     Result
    ]),
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '3d' },
  }),
  HttpModule,
  userSessionModule,
  PromptGuidModule,
  ColorModule

],
exports:[CloudinaryProvider]
,
  controllers: [AppController, AuthController, UsersController, DesignTypeController, 
    RoomDesignController, 
    DressDesignController,
    ResultController
  ],
  providers: [AppService, AuthService, DesignTypeService,
              RoomDesignService,
              UploaderService,
              DressDesignService,
              ResultService,
              CloudinaryProvider,
              UserService,
              HttpModule],
})
export class AppModule implements NestModule {
  constructor(public loader: LazyModuleLoader){

  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('/');
  }
  //https://docs.nestjs.com/fundamentals/lazy-loading-modules
  async onApplicationBootstrap() {
  //this.loader.load(()=> ColorModule);
    console.log('lazy module was loaded');
  }
}
