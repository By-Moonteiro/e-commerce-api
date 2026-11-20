import type { JwtPayload } from './jwt-payload.type.js';

export type AuthRequest = {
  headers: {
    authorization?: string;
  };
  user?: JwtPayload;
};
