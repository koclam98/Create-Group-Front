import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@Injectable()
export class ParticipantService {
  constructor(private prisma: PrismaService) {}

  // 모든 참여자 조회
  async findAll() {
    return this.prisma.participant.findMany({
      include: {
        profile: true,
        meetings: true,
      },
    });
  }

  // 특정 참여자 조회
  async findOne(id: string) {
    const participant = await this.prisma.participant.findUnique({
      where: { id },
      include: {
        profile: true,
        meetings: true,
      },
    });

    if (!participant) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return participant;
  }

  // 참여자 생성
  async create(createParticipantDto: CreateParticipantDto) {
    return this.prisma.participant.create({
      data: createParticipantDto,
      include: {
        profile: true,
      },
    });
  }

  // 참여자  수정
  async update(id: string, updateParticipantDto: UpdateParticipantDto) {
    return this.prisma.participant.update({
      where: { id },
      data: updateParticipantDto,
      include: {
        profile: true,
      },
    });
  }

  // 참여자 삭제
  async remove(id: string) {
    await this.findOne(id); // 존재 확인

    return this.prisma.participant.delete({
      where: { id },
    });
  }
}
