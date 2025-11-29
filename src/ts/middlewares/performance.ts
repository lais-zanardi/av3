import { Request, Response, NextFunction } from 'express';

export const measureProcessingTime = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationNs = end - start;
    const durationMs = Number(durationNs) / 1000000; 

    console.log(`[PERF] ${req.method} ${req.originalUrl}: ${durationMs.toFixed(2)}ms`);

    res.setHeader('X-Processing-Time-Ms', durationMs.toFixed(2)); 
  });

  next();
};