import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.meeting.findMany({
      include: {
        host: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: {
        host: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!meeting) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }

    return meeting;
  }

  async create(createMeetingDto: CreateMeetingDto) {
    return this.prisma.meeting.create({
      data: {
        ...createMeetingDto,
        date: new Date(createMeetingDto.date),
      },
      include: {
        host: true,
      },
    });
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto) {
    await this.findOne(id);

    return this.prisma.meeting.update({
      where: { id },
      data: {
        ...updateMeetingDto,
        date: updateMeetingDto.date
          ? new Date(updateMeetingDto.date)
          : undefined,
      },
      include: {
        host: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.meeting.delete({
      where: { id },
    });
  }

  // 특정 참여자가 개설한 모임 조회
  async findByHost(hostId: string) {
    return this.prisma.meeting.findMany({
      where: { hostId },
      include: {
        host: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }
}
