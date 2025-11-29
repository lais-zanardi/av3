import { Request, Response, NextFunction } from 'express';

export const measureProcessingTime = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  const originalEnd = res.end;

  // @ts-ignore
  res.end = function (...args: any[]) {
    const end = process.hrtime.bigint();
    const durationNs = end - start;
    const durationMs = Number(durationNs) / 1000000;

    if (!res.headersSent) {
      res.setHeader('X-Processing-Time-Ms', durationMs.toFixed(2));

      console.log(`[PERF] ${req.method} ${req.originalUrl}: ${durationMs.toFixed(2)}ms`);
      return originalEnd.apply(res, args as any);
    };

    next();
  };
};