import { ServerAPI } from "decky-frontend-lib";

export enum Setting {
  BarColor = "barColor",
  EmptyBarColor = "emptyBarColor",
  ContainerColor = "containerColor",
  IconColor = "iconColor",
  ContainerRadius = "containerRadius",
  ContainerShadow = "containerShadow",
}

export class Settings {
  serverAPI: ServerAPI;

  constructor(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
  }

  defaults: Record<Setting, any> = {
    barColor: "#1a9fff",
    emptyBarColor: "#000000",
    containerColor: "#23262e",
    iconColor: "#ffffff",
    containerRadius: "0px",
    containerShadow: true,
  };

  cache: Partial<Record<Setting, any>> = {};

  async load(key: Setting) {
    if (this.cache[key]) {
      return this.cache[key];
    }

    const response = await this.serverAPI.callPluginMethod("settings_load", {
      key: key,
      defaults: this.defaults[key],
    });

    if (response.success) {
      return (this.cache[key] = response.result);
    } else {
      return this.defaults[key];
    }
  }

  async save(key: Setting, value: any) {
    this.cache[key] = value;

    await this.serverAPI.callPluginMethod("settings_save", {
      key: key,
      value: value,
    });
  }

  resetToDefaults() {
    this.cache = { ...this.defaults };

    for (const key of Object.values(Setting)) {
      this.serverAPI.callPluginMethod("settings_save", {
        key: key,
        value: this.defaults[key],
      });
    }
  }
}
