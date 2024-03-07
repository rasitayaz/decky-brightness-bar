import { definePlugin, ServerAPI, staticClasses } from "decky-frontend-lib";
import { FaSun } from "react-icons/fa";
import { BrightnessBar } from "./lib/components/brightness_bar";
import { QAMContent } from "./lib/components/qam_content";
import { AppContext } from "./lib/utils/context";

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
