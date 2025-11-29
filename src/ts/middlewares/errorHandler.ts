import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import Logger from '../utils/Logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (err instanceof AppError) {
    Logger.info(`AppError: ${err.message}`, { path: req.path });
    
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  Logger.error(`Erro Interno não tratado: ${err.message}`, err.stack);

  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor. Contate o suporte.',
  });
}