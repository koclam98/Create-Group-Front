import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    return this.prisma.profile.create({
      data: createProfileDto,
      include: {
        participant: true,
      },
    });
  }

  async findByParticipantId(participantId: string) {
    return this.prisma.profile.findUnique({
      where: { participantId },
      include: {
        participant: true,
      },
    });
  }

  async update(participantId: string, updateProfileDto: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { participantId },
      data: updateProfileDto,
      include: {
        participant: true,
      },
    });
  }

  async remove(participantId: string) {
    return this.prisma.profile.delete({
      where: { participantId },
    });
  }
}
