import dotenv from 'dotenv';
import expand from 'dotenv-expand';
import fs from 'fs-extra';
import { logger } from './logger';

export default function ({ dotenv: dotenvBase }: { dotenv: string }): void {
  if (!process.env.NODE_ENV) {
    logger.warn('The NODE_ENV environment variable was not set. Defaulting to "development".');
  }
  const NODE_ENV = process.env.NODE_ENV ?? 'development';

  // https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
  const dotenvFiles = [
    `${dotenvBase}.${NODE_ENV}.local`,
    `${dotenvBase}.${NODE_ENV}`,
    NODE_ENV !== 'test' && `${dotenvBase}.local`,
    dotenvBase,
  ].filter(Boolean) as string[];
  // Load environment variables from .env* files. Suppress warnings using silent
  // if this file is missing. dotenv will never modify any environment variables
  // that have already been set. Variable expansion is supported in .env files.
  // https://github.com/motdotla/dotenv
  // https://github.com/motdotla/dotenv-expand
  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      expand(
        dotenv.config({
          path: dotenvFile,
        })
      );
    }
  });
}
