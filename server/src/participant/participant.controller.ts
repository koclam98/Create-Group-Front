import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@Controller('participants')
export class ParticipantController {
  constructor(private readonly ps: ParticipantService) {}

  @Get()
  findAll() {
    return this.ps.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ps.findOne(id);
  }

  @Post()
  create(@Body() createParticipantDto: CreateParticipantDto) {
    return this.ps.create(createParticipantDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ) {
    return this.ps.update(id, updateParticipantDto);
  }

  @Delete(':id')
  remove(@Param(':id') id: string) {
    return this.ps.remove(id);
  }
}
