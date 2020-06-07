import pino from "pino";

import { LOG_LEVEL } from "../config";

const logger = pino({ level: LOG_LEVEL });

export default logger;
