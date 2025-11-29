import { Request, Response } from 'express';
import PecaService from '../services/PecaService';

class PecaController {
  async index(req: Request, res: Response) {
    const pecas = await PecaService.listarPecas();
    return res.json(pecas);
  }

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body; 

    const peca = await PecaService.atualizarStatusPeca(id, status);
    return res.json(peca);
  }
}

export default new PecaController();