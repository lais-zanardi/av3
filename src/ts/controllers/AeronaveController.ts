import { Request, Response, NextFunction } from 'express';
import AeronaveRepository from '../repositories/AeronaveRepository';
import EtapaService from '../services/EtapaService';

class AeronaveController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const aeronaves = await AeronaveRepository.findAll();
      return res.json(aeronaves);
    } catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const aeronave = await AeronaveRepository.create(req.body);
      return res.status(201).json(aeronave);
    } catch (error) { next(error); }
  }

  async relatorio(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resultado = await EtapaService.gerarRelatorioAeronave(id);
      return res.json(resultado);
    } catch (error) { next(error); }
  }
}

export default new AeronaveController();