import "express";
import { RequestTokenInformation } from "src/providers/token-provider/token_payload.interface";

declare module "express" {
  export interface Request {
    user?: RequestTokenInformation;
  }
}
