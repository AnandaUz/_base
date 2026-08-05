export type PageParams = Record<string, string>;

export type PageResult = {
  html: string;
  title?: string;
  init?: () => void;
  unmount?: () => void;
};

export type Page = (params: PageParams) => PageResult;

export interface RouteConfig {
  path: string;
  // ленивая загрузка — модуль подтянется только при переходе
  load: () => Promise<Page>;
  // тайтл можно задать статично или как функцию от параметров
  title?: string | ((params: PageParams) => string);
}
