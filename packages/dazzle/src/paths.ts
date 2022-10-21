import fs from 'fs';
import path from 'path';
import url from 'url';

import { logger } from './logger';
import { DazzlePaths } from './types';

const ___filename = url.fileURLToPath(import.meta.url);
const ___dirname = path.dirname(___filename);

// import clearConsole from 'react-dev-utils/clearConsole';
// import logger from 'razzle-dev-utils/logger';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(path.join(process.cwd(), process.env.DAZZLE_APP_PATH || ''));
const resolveApp = (relativePath: string): string => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path: string, needsSlash: boolean) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(0, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = (appPackageJson: string): string | undefined => {
  if (envPublicUrl) {
    return envPublicUrl;
  }

  if (fs.existsSync(appPackageJson)) {
    try {
      const packageJson = require(appPackageJson);
      return packageJson.homepage;
    } catch (e) {
      logger.error('Invalid package.json.', e);
      process.exit(1);
    }
  }

  return undefined;
};

function getServedPath(appPackageJson: string) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname || '' : '/');
  return ensureSlash(servedUrl, true);
}

const resolveOwn = (relativePath: string): string => path.resolve(___dirname, '..', relativePath);

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
const nodePaths = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter((folder) => folder && !path.isAbsolute(folder))
  .map((folder) => path.resolve(appDirectory, folder))
  .join(path.delimiter);

const defaultPaths: DazzlePaths = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appPublic: resolveApp('public'),
  appConfig: resolveApp('dazzle.config'),
  appNodeModules: resolveApp('node_modules'),
  appPackageJson: resolveApp('package.json'),
  nodePaths: nodePaths,
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'),
};

export default defaultPaths;
