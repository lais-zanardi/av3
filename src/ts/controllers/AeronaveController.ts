import { Request, Response } from 'express';
import AeronaveRepository from '../repositories/AeronaveRepository';
import EtapaService from '../services/EtapaService';

class AeronaveController {
  async index(req: Request, res: Response) {
    const aeronaves = await AeronaveRepository.findAll();
    return res.json(aeronaves);
  }

  async create(req: Request, res: Response) {
    const aeronave = await AeronaveRepository.create(req.body);
    return res.status(201).json(aeronave);
  }

  async relatorio(req: Request, res: Response) {
    const { id } = req.params;
    const resultado = await EtapaService.gerarRelatorioAeronave(id);
    return res.json(resultado);
  }
}

export default new AeronaveController();