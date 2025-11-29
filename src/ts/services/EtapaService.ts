import prisma from '../repositories/prisma'; 
import EtapaRepository from '../repositories/EtapaRepository'; 
import PecaRepository from '../repositories/PecaRepository';
import AeronaveRepository from '../repositories/AeronaveRepository';
import { StatusEtapa, ResultadoTeste, StatusPeca } from '@prisma/client';

class EtapaService {
  async carregarPecaEmEtapa(pecaId: string, etapaId: string) {
    const peca = await PecaRepository.findById(pecaId);
    const etapa = await prisma.etapa.findUnique({ where: { id: etapaId } }); 

    if (!peca || !etapa) {
      throw new Error('Peça ou Etapa não encontradas.');
    }

    if (peca.aeronaveId !== etapa.aeronaveId) {
      throw new Error('Erro de Integridade: A peça e a etapa pertencem a aeronaves diferentes.');
    }

    return await EtapaRepository.addPeca(etapaId, pecaId);
  }

  async gerarRelatorioAeronave(aeronaveId: string) {
    const aeronave = await AeronaveRepository.findById(aeronaveId);

    if (!aeronave) {
      throw new Error('Aeronave não encontrada.');
    }

    const etapas = aeronave.etapas || [];
    const testes = aeronave.testes || [];
    const pecas = aeronave.pecas || [];

    const etapasPendentes = etapas.filter(etapa => etapa.status !== StatusEtapa.CONCLUIDA);
    if (etapasPendentes.length > 0) {
      throw new Error(
        `Impossível gerar relatório: Existem ${etapasPendentes.length} etapas não concluídas.`
      );
    }

    const testesReprovados = testes.filter(teste => teste.resultado === ResultadoTeste.REPROVADO);
    if (testesReprovados.length > 0) {
      throw new Error(
        `Impossível gerar relatório: Existem ${testesReprovados.length} testes REPROVADOS. A aeronave requer revisão.`
      );
    }
    
    const pecasNaoProntas = pecas.filter(peca => peca.statusPeca !== StatusPeca.PRONTA);
    if (pecasNaoProntas.length > 0) {
       throw new Error(
        `Impossível gerar relatório: Existem peças que ainda não estão com status PRONTA.`
      );
    }

    const relatorioExistente = await prisma.relatorio.findFirst({ where: { aeronaveId } });
    if (relatorioExistente) {
        return relatorioExistente;
    }

    const novoRelatorio = await prisma.relatorio.create({
      data: {
        aeronaveId: aeronaveId,
        dataCriacao: new Date(),
      }
    });

    return {
      status: 'SUCESSO',
      mensagem: 'Aeronave aprovada em todos os critérios de qualidade.',
      relatorio: novoRelatorio
    };
  }
}

export default new EtapaService();