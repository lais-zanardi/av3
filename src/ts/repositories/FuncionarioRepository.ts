import prisma from './prisma';
import { Prisma, Funcionario } from '@prisma/client';

class FuncionarioRepository {
  async create(data: Prisma.FuncionarioCreateInput): Promise<Funcionario> {
    return await prisma.funcionario.create({
      data,
    });
  }

  async findByUsuario(usuario: string): Promise<Funcionario | null> {
    return await prisma.funcionario.findUnique({
      where: { usuario },
    });
  }

  async findById(id: string): Promise<Funcionario | null> {
    return await prisma.funcionario.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Funcionario[]> {
    return await prisma.funcionario.findMany();
  }

  async update(id: string, data: Prisma.FuncionarioUpdateInput): Promise<Funcionario> {
    return await prisma.funcionario.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Funcionario> {
    return await prisma.funcionario.delete({
      where: { id },
    });
  }
}

export default new FuncionarioRepository();