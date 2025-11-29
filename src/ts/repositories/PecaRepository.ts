import prisma from './prisma';
import { Prisma, Peca, StatusPeca } from '@prisma/client';

class PecaRepository {
  async create(data: Prisma.PecaCreateInput): Promise<Peca> {
    return await prisma.peca.create({
      data,
    });
  }

  async findAll(): Promise<Peca[]> {
    return await prisma.peca.findMany({
      include: {
        aeronave: true, 
      }
    });
  }

  async findById(id: string): Promise<Peca | null> {
    return await prisma.peca.findUnique({
      where: { id },
    });
  }

  async findByAeronaveId(aeronaveId: string): Promise<Peca[]> {
    return await prisma.peca.findMany({
      where: { aeronaveId },
    });
  }

  async updateStatus(id: string, newStatus: StatusPeca): Promise<Peca> {
    return await prisma.peca.update({
      where: { id },
      data: {
        statusPeca: newStatus,
      },
    });
  }
  
  async delete(id: string): Promise<Peca> {
    return await prisma.peca.delete({
      where: { id },
    });
  }
}

export default new PecaRepository();