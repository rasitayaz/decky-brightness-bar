import {
  ButtonItem,
  definePlugin,
  DialogButton,
  Navigation,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaSun } from "react-icons/fa";

import logo from "../assets/logo.png";
import { getBrightnessBarHTML } from "./lib/brightness_bar";

declare global {
  interface Window {
    BrightnessBarWindow: Window | undefined;
  }
}

// -1 means uninitialized, it is to prevent the brightness bar from showing up when the plugin is first loaded
let currentBrightness = -1;

// helps with keeping the bar visible while repeatedly changing the brightness
let triggeredAt: number = Date.now();

let brightnessBarVisible = false;
let displayingToast = false;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Used to bring Steam UI to the front.
 * When playing a game, brightness bar doesn't show up unless the Steam UI is visible.
 *
 * @param serverAPI is required to display the toast
 */
async function displayInvisibleToast(serverAPI: ServerAPI) {
  if (displayingToast) return;

  displayingToast = true;

  while (brightnessBarVisible) {
    serverAPI.toaster.toast({
      title: "",
      body: "",
      sound: -1,
      duration: 1,
      className: "DialogDraggable DraggedOut",
    });

    await delay(1600);
  }

  displayingToast = false;
}

/**
 * Listens to brightness changes and displays the brightness bar.
 *
 * @param brightness new brightness level between 0 and 1
 * @param serverAPI is passed to display the toast
 */
async function onBrightnessChange(brightness: number, serverAPI: ServerAPI) {
  const newBrightness = Math.round(brightness * 100);

  if (currentBrightness === -1) {
    currentBrightness = newBrightness;
    return;
  }

  currentBrightness = newBrightness;
  triggeredAt = Date.now();

  const animDuration = 220;
  const displayDuration = 1000;

  if (window.BrightnessBarWindow) {
    await delay(animDuration);

    if (window.BrightnessBarWindow) {
      if (!brightnessBarVisible) {
        window.BrightnessBarWindow.close();
      } else {
        if (brightnessBarVisible) {
          const win = window.BrightnessBarWindow;

          win.document.body.innerHTML = getBrightnessBarHTML({
            brightness: currentBrightness,
            animate: false,
          });
        }

        return;
      }
    }
  }

  const { browserView: view, strCreateURL: url } =
    window.SteamClient.BrowserView.CreatePopup({
      parentPopupBrowserID: 2,
    });

  view.SetVisible(false);
  view.SetName("BrightnessBar");
  // view.SetBounds(-8, -8, 870, 550); entire screen?
  view.SetBounds(-8, -8, 300, 64);

  const win = window.open(
    url,
    undefined,
    "status=0,toolbar=0,menubar=0,location=0"
  );

  if (!win) return;

  window.BrightnessBarWindow = win;

  win.document.title = "BrightnessBar";

  // show the brightness bar with animation
  win.document.body.innerHTML = getBrightnessBarHTML({
    brightness: currentBrightness,
    animate: true,
  });

  brightnessBarVisible = true;
  displayInvisibleToast(serverAPI);

  view.SetVisible(true);

  await delay(animDuration);

  // update the brightness without animation
  win.document.body.innerHTML = getBrightnessBarHTML({
    brightness: currentBrightness,
    animate: false,
  });

  await delay(displayDuration);

  while (Date.now() - triggeredAt < displayDuration) {
    await delay(displayDuration);
  }

  // hide the brightness bar with animation
  win.document.body.innerHTML = getBrightnessBarHTML({
    brightness: currentBrightness,
    animate: true,
    reverse: true,
  });

  await delay(animDuration);
  brightnessBarVisible = false;

  win.close();
  window.BrightnessBarWindow = undefined;
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  // const [result, setResult] = useState<number | undefined>();

  // const onClick = async () => {
  //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
  //     "add",
  //     {
  //       left: 2,
  //       right: 2,
  //     }
  //   );
  //   if (result.success) {
  //     setResult(result.result);
  //   }
  // };

  return (
    <PanelSection title="Panel Section">
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={async () => {
            const response = await serverAPI.callPluginMethod(
              "get_brightness_level",
              {}
            );

            serverAPI.toaster.toast({
              title: "brightness",
              body: response.result,
              critical: true,
              duration: 1000,
            });

            /* showContextMenu(
              <Menu label="Menu" cancelText="CAAAANCEL" onCancel={() => {}}>
                <MenuItem onSelected={() => {}}>Item #1</MenuItem>
                <MenuItem onSelected={() => {}}>Item #2</MenuItem>
                <MenuItem onSelected={() => {}}>Item #3</MenuItem>
              </Menu>,
              e.currentTarget ?? window
            ); */
          }}
        >
          Server says yo
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={logo} />
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            Navigation.CloseSideMenus();
            Navigation.Navigate("/decky-plugin-test");
          }}
        >
          Router
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

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

  const brightnessRegistration =
    window.SteamClient.System.Display.RegisterForBrightnessChanges(
      (data: any) => onBrightnessChange(data.flBrightness, serverAPI)
    );

  return {
    title: <div className={staticClasses.Title}>Brightness Bar</div>,
    content: <Content serverAPI={serverAPI} />,
    icon: <FaSun />,
    onDismount() {
      serverAPI.routerHook.removeRoute("/decky-plugin-test");
      brightnessRegistration.unregister();
    },
  };
});
