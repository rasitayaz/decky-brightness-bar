import { definePlugin, ServerAPI, staticClasses } from "decky-frontend-lib";
import { BrightnessBar } from "./lib/components/brightness_bar";
import { BrightnessIcon } from "./lib/components/brightness_icon";
import { QAMContent } from "./lib/components/qam_content";
import { AppContext } from "./lib/utils/context";

export default definePlugin((serverAPI: ServerAPI) => {
  AppContext.init(serverAPI);

  serverAPI.routerHook.addGlobalComponent("BrightnessBar", BrightnessBar);

  return {
    title: <div className={staticClasses.Title}>Brightness Bar</div>,
    content: <QAMContent />,
    icon: <BrightnessIcon size={16} />,
    onDismount() {
      serverAPI.routerHook.removeGlobalComponent("BrightnessBar");
    },
  };
});
