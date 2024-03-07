import { definePlugin, ServerAPI, staticClasses } from "decky-frontend-lib";
import { FaSun } from "react-icons/fa";

import { BrightnessBar } from "./lib/brightness_bar";
import { AppContext } from "./lib/context";
import { QAMContent } from "./lib/qam_content";

export default definePlugin((serverAPI: ServerAPI) => {
  AppContext.init(serverAPI);

  serverAPI.routerHook.addGlobalComponent("BrightnessBar", BrightnessBar);

  return {
    title: <div className={staticClasses.Title}>Brightness Bar</div>,
    content: <QAMContent />,
    icon: <FaSun />,
    onDismount() {
      serverAPI.routerHook.removeGlobalComponent("BrightnessBar");
    },
  };
});
