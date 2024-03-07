import { ServerAPI } from "decky-frontend-lib";
import { Settings } from "./settings";

export let appContext: AppContext;

export class AppContext {
  serverAPI: ServerAPI;
  settings: Settings;

  constructor(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
    this.settings = new Settings(serverAPI);
  }

  static init(serverAPI: ServerAPI) {
    appContext = new AppContext(serverAPI);
  }
}
