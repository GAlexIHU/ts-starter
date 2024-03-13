import pino from "pino";

/**
 * @todo Should be better defined in custom logger interface
 */
export type Logger = pino.Logger;

export const rootLogger = pino() as Logger;
