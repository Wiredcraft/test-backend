#!/usr/bin/env node

import { logger } from "./index";

export function job() {
  logger.info("running some job");
}

job();
