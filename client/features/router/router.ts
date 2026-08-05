import type { Page, PageParams, RouteConfig } from "./types.js";

export class Router {
  currentPageUnmount?: (() => void) | undefined;
  private pageCache = new Map<string, Page>();
  private routes!: RouteConfig[];
  private notFoundRoute!: RouteConfig;

  init(routes: RouteConfig[], notFoundRoute: RouteConfig) {
    this.routes = routes;
    this.notFoundRoute = notFoundRoute;

    window.addEventListener("popstate", () => this.render());

    document.addEventListener("click", (e) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a || !a.href) return;

      const url = new URL(a.href);
      if (url.origin !== location.origin) return;

      e.preventDefault();
      this.navigate(url.pathname);
    });

    this.render();
  }

  private matchRoute(path: string): { route: RouteConfig; params: PageParams } {
    const exact = this.routes.find((r) => r.path === path);
    if (exact) return { route: exact, params: {} };

    for (const route of this.routes) {
      const paramNames: string[] = [];
      const regexStr = route.path.replace(/:([^/]+)/g, (_, name) => {
        paramNames.push(name);
        return "([^/]+)";
      });

      const match = path.match(new RegExp(`^${regexStr}$`));
      if (match) {
        const params: PageParams = {};
        paramNames.forEach((name, i) => {
          params[name] = match[i + 1]!;
        });
        return { route, params };
      }
    }

    return { route: this.notFoundRoute, params: {} };
  }

  private async loadPage(route: RouteConfig): Promise<Page> {
    const cached = this.pageCache.get(route.path);
    if (cached) return cached;

    const page = await route.load();
    this.pageCache.set(route.path, page);
    return page;
  }

  private resolveTitle(
    route: RouteConfig,
    params: PageParams,
    fallback?: string,
  ): string {
    if (typeof route.title === "function") return route.title(params);
    return route.title ?? fallback ?? "";
  }

  showLoader(): void {}

  hideLoader(): void {}

  navigate(path: string): void {
    history.pushState({}, "", path);
    this.render();
  }
  checkRedirect(path: string): string {
    return path;
  }

  async render(): Promise<void> {
    this.currentPageUnmount?.();

    let path = window.location.pathname;
    path = this.checkRedirect(path);

    const { route, params } = this.matchRoute(path);
    const renderToken = path; // защита от гонки при быстрой навигации
    const main = document.querySelector("main");

    // если чанк ещё не в кеше — грузится не мгновенно, показываем лоадер с задержкой
    const isCached = this.pageCache.has(route.path);

    if (!isCached && main) {
      if (renderToken === window.location.pathname) {
        this.showLoader();
      }
    }

    try {
      const page = await this.loadPage(route);

      this.hideLoader();

      // если пока грузили страницу, юзер успел уйти на другой путь — не рендерим устаревшее
      if (renderToken !== window.location.pathname) return;

      if (!main) throw new Error("Элемент main не найден в DOM");

      const { html, title, init, unmount } = page(params);
      main.innerHTML = html;
      document.title = this.resolveTitle(route, params, title);
      init?.();
      this.currentPageUnmount = unmount;
    } catch (e) {
      this.hideLoader();
      console.error("Ошибка роутера:", e);
    }
  }
}
