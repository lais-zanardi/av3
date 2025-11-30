import { Request, Response, NextFunction } from 'express';
import PecaService from '../services/PecaService';

class PecaController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const pecas = await PecaService.listarPecas();
      return res.json(pecas);
    } catch (error) { next(error); }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body; 
      const peca = await PecaService.atualizarStatusPeca(id, status);
      return res.json(peca);
    } catch (error) { next(error); }
  }
}

export default new PecaController();