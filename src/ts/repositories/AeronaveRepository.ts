import prisma from './prisma';
import { Prisma, Aeronave } from '@prisma/client';

type AeronaveCompleta = Prisma.AeronaveGetPayload<{
  include: {
    pecas: true;
    etapas: true;
    testes: true;
  }
}>;

class AeronaveRepository {
  async create(data: Prisma.AeronaveCreateInput): Promise<Aeronave> {
    return await prisma.aeronave.create({
      data,
    });
  }

  async findAll(): Promise<Aeronave[]> {
    return await prisma.aeronave.findMany();
  }

  async findById(id: string): Promise<AeronaveCompleta | null> {
    return await prisma.aeronave.findUnique({
      where: { id },
      include: {
        pecas: true,
        etapas: true,
        testes: true, 
      }
    });
  }

  async findByCodigo(codigo: string): Promise<Aeronave | null> {
    return await prisma.aeronave.findUnique({
      where: { codigo },
    });
  }

  async update(id: string, data: Prisma.AeronaveUpdateInput): Promise<Aeronave> {
    return await prisma.aeronave.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Aeronave> {
    return await prisma.aeronave.delete({
      where: { id },
    });
  }
}

export default new AeronaveRepository();