import type express from 'express';

export interface Context {
  request: express.Request;
}
