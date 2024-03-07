import { ServerAPI } from "decky-frontend-lib";
import { Settings } from "./settings";

export let context: AppContext;

export class AppContext {
  serverAPI: ServerAPI;
  settings: Settings;

  constructor(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
    this.settings = new Settings(serverAPI);
  }

  static init(serverAPI: ServerAPI) {
    context = new AppContext(serverAPI);
  }
}
