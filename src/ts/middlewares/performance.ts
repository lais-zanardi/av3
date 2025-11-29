import type { Request, Response, NextFunction } from "express";

export const measureProcessingTime = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();

  // Override seguro do .end — garante setHeader ANTES do envio
  const originalEnd = res.end;

  // @ts-ignore
  res.end = function (...args: any[]) {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    // Só define header antes do envio
    if (!res.headersSent) {
      try {
        res.setHeader("X-Processing-Time-Ms", durationMs.toFixed(2));
      } catch (_) {
        // ignora, apenas por segurança
      }
    }

    console.log(`[PERF] ${req.method} ${req.originalUrl}: ${durationMs.toFixed(2)}ms`);

    return originalEnd.apply(res, args as any);
  };

  next();
};
