import webpack from 'webpack';

export interface RazzleWebpack5LoaderOptions {
  razzleBuildName?: string;
  browserslistEnv?: string;
  hasJsxRuntime: boolean;
  hasReactRefresh: boolean;
  isServer: boolean;
  development: boolean;
  sourceMaps?: boolean | 'inline' | 'both' | null | undefined;
  overrides: any;
  caller: any;
  configFile: string | undefined;
  cwd: string;
}

export interface RazzleWebpack5LoaderDefinitionFunction
  extends webpack.LoaderDefinitionFunction<
    RazzleWebpack5LoaderOptions,
    {
      target: string | [string, string];
    }
  > {}

export type RazzleWebpack5LoaderContext = ThisParameterType<RazzleWebpack5LoaderDefinitionFunction>;

export type SourceMap = Parameters<RazzleWebpack5LoaderContext['callback']>[2];
export type Source = Parameters<RazzleWebpack5LoaderContext['callback']>[1];
