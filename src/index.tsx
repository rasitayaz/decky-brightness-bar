import {
  definePlugin,
  DialogButton,
  Navigation,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaSun } from "react-icons/fa";

import { Logic } from "./lib/logic";
import { QAMContent } from "./lib/qam_content";
import { Settings } from "./lib/settings";

const DeckyPluginRouterTest: VFC = () => {
  return (
    <div style={{ marginTop: "50px", color: "white" }}>
      Hello World!
      <DialogButton onClick={() => Navigation.NavigateToLibraryTab()}>
        Go to Library
      </DialogButton>
    </div>
  );
};

export default definePlugin((serverAPI: ServerAPI) => {
  serverAPI.routerHook.addRoute("/decky-plugin-test", DeckyPluginRouterTest, {
    exact: true,
  });

  const settings = new Settings(serverAPI);
  const logic = new Logic(serverAPI, settings);

  const brightnessRegistration =
    window.SteamClient.System.Display.RegisterForBrightnessChanges((val: any) =>
      logic.onBrightnessChange(val)
    );

  const inputRegistration =
    window.SteamClient.Input.RegisterForControllerStateChanges((val: any) =>
      logic.onControllerStateChange(val)
    );

  return {
    title: <div className={staticClasses.Title}>Brightness Bar</div>,
    content: <QAMContent serverAPI={serverAPI} settings={settings} />,
    icon: <FaSun />,
    onDismount() {
      serverAPI.routerHook.removeRoute("/decky-plugin-test");
      brightnessRegistration.unregister();
      inputRegistration.unregister();
    },
  };
});
