import {
  AppRoute,
  ServerInferRequest,
  ServerInferResponses,
} from "@ts-rest/core";
import { FastifyReply, FastifyRequest } from "fastify";

export type RouteHandler<T extends AppRoute> = (
  input: ServerInferRequest<T, FastifyRequest["headers"]> & {
    request: FastifyRequest;
    reply: FastifyReply;
  },
) => Promise<ServerInferResponses<T>>;
