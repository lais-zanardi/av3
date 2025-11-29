import prisma from './prisma';
import { Prisma, Etapa, StatusEtapa } from '@prisma/client';

class EtapaRepository {
  async create(data: Prisma.EtapaCreateInput): Promise<Etapa> {
    return await prisma.etapa.create({
      data,
    });
  }

  async findAll(): Promise<Etapa[]> {
    return await prisma.etapa.findMany({
      include: {
        aeronave: true,
      }
    });
  }

  async findById(id: string): Promise<Etapa | null> {
    return await prisma.etapa.findUnique({
      where: { id },
      include: {
        aeronave: true,
        pecas: true,        
        funcionarios: true, 
      }
    });
  }

  async findByAeronaveId(aeronaveId: string): Promise<Etapa[]> {
    return await prisma.etapa.findMany({
      where: { aeronaveId },
      orderBy: {
        prazo: 'asc', 
      }
    });
  }

  async update(id: string, data: Prisma.EtapaUpdateInput): Promise<Etapa> {
    return await prisma.etapa.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: StatusEtapa): Promise<Etapa> {
    return await prisma.etapa.update({
      where: { id },
      data: { status },
    });
  }

  async addPeca(etapaId: string, pecaId: string): Promise<Etapa> {
    return await prisma.etapa.update({
      where: { id: etapaId },
      data: {
        pecas: {
          connect: { id: pecaId }
        }
      },
      include: { pecas: true }
    });
  }

  async removePeca(etapaId: string, pecaId: string): Promise<Etapa> {
    return await prisma.etapa.update({
      where: { id: etapaId },
      data: {
        pecas: {
          disconnect: { id: pecaId }
        }
      },
      include: { pecas: true }
    });
  }

  async addFuncionario(etapaId: string, funcionarioId: string): Promise<Etapa> {
    return await prisma.etapa.update({
      where: { id: etapaId },
      data: {
        funcionarios: {
          connect: { id: funcionarioId }
        }
      },
      include: { funcionarios: true }
    });
  }

  async delete(id: string): Promise<Etapa> {
    return await prisma.etapa.delete({
      where: { id },
    });
  }
}

export default new EtapaRepository();