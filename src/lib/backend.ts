import { ServerAPI } from "decky-frontend-lib";

export class Backend {
  serverAPI: ServerAPI;

  constructor(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
  }

  async bridge(functionName: string, namedArgs?: any) {
    namedArgs = namedArgs ? namedArgs : {};
    console.debug(`[BrightnessBar] Calling backend function: ${functionName}`);
    let output = await this.serverAPI.callPluginMethod(functionName, namedArgs);
    return output.result;
  }

  async getSetting(key: string, defaults: any) {
    let output = await this.bridge("settings_get", { key, defaults });
    return output;
  }

  async setSetting(key: string, value: any) {
    let output = await this.bridge("settings_set", { key, value });
    return output;
  }

  async commitSettings() {
    let output = await this.bridge("settings_commit");
    return output;
  }
}
