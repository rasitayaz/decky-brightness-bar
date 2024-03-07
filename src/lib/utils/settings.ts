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
  private readonly serverAPI: ServerAPI;

  constructor(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
  }

  private cache: Partial<Record<Setting, any>> = {};
  private subscribers: Map<string, () => void> = new Map();

  defaults: Record<Setting, any> = {
    barColor: "#1a9fff",
    emptyBarColor: "#000000",
    containerColor: "#23262e",
    iconColor: "#ffffff",
    containerRadius: "0px",
    containerShadow: true,
  };

  subscribe(id: string, callback: () => void): void {
    this.subscribers.set(id, callback);
  }

  unsubscribe(id: string): void {
    this.subscribers.delete(id);
  }

  notifySubscribers() {
    for (const callback of this.subscribers.values()) {
      callback();
    }
  }

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
    this.notifySubscribers();

    await this.serverAPI.callPluginMethod("settings_save", {
      key: key,
      value: value,
    });
  }

  resetToDefaults() {
    this.cache = { ...this.defaults };
    this.notifySubscribers();

    for (const key of Object.values(Setting)) {
      this.serverAPI.callPluginMethod("settings_save", {
        key: key,
        value: this.defaults[key],
      });
    }
  }
}
