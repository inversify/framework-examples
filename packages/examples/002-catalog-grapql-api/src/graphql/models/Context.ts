import type express from 'express';

export interface Context {
  readonly request: express.Request;
}
