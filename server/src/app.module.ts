import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ParticipantModule } from './participant/participant.module';
import { ProfileModule } from './profile/profile.module';
import { MeetingModule } from './metting/meeting.module';

@Module({
  imports: [PrismaModule, ParticipantModule, ProfileModule, MeetingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
