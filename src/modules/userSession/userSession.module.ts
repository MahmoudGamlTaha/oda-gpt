import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionService } from 'src/common/userSession.service';
import { UserSession } from 'src/model/userSession.entity';

@Module({
    imports:[TypeOrmModule.forFeature([UserSession])],
    providers: [UserSessionService],
    exports: [UserSessionService],
  })
export class userSessionModule{}