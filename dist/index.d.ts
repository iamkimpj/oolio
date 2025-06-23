import request from "./request.js";

interface Route {
  method: string;
  path: string;
  payload?: string[];
  files?: string[];
  authorization?: boolean;
}

interface Routes {
  [category: string]: {
    [fnName: string]: Route;
  };
}

interface OolioConfig {
  routes: Routes;
  getAuthorizeToken: () => string | null;
  baseUrl: string;
}

declare function oolio(config: OolioConfig): Record<string, any>;

export default oolio;