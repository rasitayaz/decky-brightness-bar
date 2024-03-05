import { ServerAPI } from "decky-frontend-lib";
import { getBrightnessBarHTML } from "./brightness_bar";

declare global {
  interface Window {
    BrightnessBarWindow: Window | undefined;
  }
}

export class Logic {
  serverAPI: ServerAPI;

  // -1 means uninitialized, it is to prevent the brightness bar from showing up when the plugin is first loaded
  currentBrightness = -1;

  // helps with keeping the bar visible while repeatedly changing the brightness
  triggeredAt: number = Date.now();

  brightnessBarVisible = false;
  displayingToast = false;

  constructor(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Used to bring Steam UI to the front.
   * When playing a game, brightness bar doesn't show up unless the Steam UI is visible.
   *
   * @param this.serverAPI is required to display the toast
   */
  async displayInvisibleToast() {
    if (this.displayingToast) return;

    this.displayingToast = true;

    while (this.brightnessBarVisible) {
      this.serverAPI.toaster.toast({
        title: "",
        body: "",
        sound: -1,
        duration: 1,
        className: "DialogDraggable DraggedOut",
      });

      await this.delay(1600);
    }

    this.displayingToast = false;
  }

  /**
   * Listens to brightness changes and displays the brightness bar.
   *
   * @param brightness new brightness level between 0 and 1
   * @param this.serverAPI is passed to display the toast
   */
  async onBrightnessChange(data: { flBrightness: number }) {
    const newBrightness = Math.round(data.flBrightness * 100);

    if (this.currentBrightness === -1) {
      this.currentBrightness = newBrightness;
      return;
    }

    this.currentBrightness = newBrightness;
    this.triggeredAt = Date.now();

    const animDuration = 220;
    const displayDuration = 1000;

    if (window.BrightnessBarWindow) {
      await this.delay(animDuration);

      if (window.BrightnessBarWindow) {
        if (!this.brightnessBarVisible) {
          window.BrightnessBarWindow.close();
        } else {
          if (this.brightnessBarVisible) {
            const win = window.BrightnessBarWindow;

            win.document.body.innerHTML = getBrightnessBarHTML({
              brightness: this.currentBrightness,
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
      brightness: this.currentBrightness,
      animate: true,
    });

    this.brightnessBarVisible = true;
    this.displayInvisibleToast();

    view.SetVisible(true);

    await this.delay(animDuration);

    // update the brightness without animation
    win.document.body.innerHTML = getBrightnessBarHTML({
      brightness: this.currentBrightness,
      animate: false,
    });

    await this.delay(displayDuration);

    while (Date.now() - this.triggeredAt < displayDuration) {
      await this.delay(displayDuration);
    }

    // hide the brightness bar with animation
    win.document.body.innerHTML = getBrightnessBarHTML({
      brightness: this.currentBrightness,
      animate: true,
      reverse: true,
    });

    await this.delay(animDuration);
    this.brightnessBarVisible = false;

    win.close();
    window.BrightnessBarWindow = undefined;
  }
}
