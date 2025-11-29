import { StatusPeca } from '@prisma/client';
import PecaRepository from '../repositories/PecaRepository';

class PecaService {
  async atualizarStatusPeca(id: string, novoStatus: StatusPeca) {
    const peca = await PecaRepository.findById(id);

    if (!peca) {
      throw new Error('Peça não encontrada.');
    }

    const statusAtual = peca.statusPeca;

    if (statusAtual === novoStatus) {
      return peca; 
    }

    let transicaoValida = false;

    if (statusAtual === StatusPeca.EM_PRODUCAO && novoStatus === StatusPeca.EM_TRANSPORTE) {
      transicaoValida = true;
    } else if (statusAtual === StatusPeca.EM_TRANSPORTE && novoStatus === StatusPeca.PRONTA) {
      transicaoValida = true;
    } 

    if (!transicaoValida) {
      throw new Error(
        `Transição de status inválida: De '${statusAtual}' para '${novoStatus}' não é permitido.`
      );
    }

    return await PecaRepository.updateStatus(id, novoStatus);
  }

  async listarPecas() {
    return await PecaRepository.findAll();
  }
}

export default new PecaService();