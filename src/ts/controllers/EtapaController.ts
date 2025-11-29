import { Request, Response } from 'express';
import EtapaService from '../services/EtapaService';

class EtapaController {
  async addPeca(req: Request, res: Response) {
    const { id } = req.params; 
    const { pecaId } = req.body;

    const etapaAtualizada = await EtapaService.carregarPecaEmEtapa(pecaId, id);
    return res.json(etapaAtualizada);
  }
}

export default new EtapaController();