import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get('participant/:participantId')
  findByParticipantId(@Param('participantId') participantId: string) {
    return this.profileService.findByParticipantId(participantId);
  }

  @Patch('participant/:participantId')
  update(
    @Param('participantId') participantId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(participantId, updateProfileDto);
  }

  @Delete('participant/:participantId')
  remove(@Param('participantId') participantId: string) {
    return this.profileService.remove(participantId);
  }
}
