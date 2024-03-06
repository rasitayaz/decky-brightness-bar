import { ServerAPI } from "decky-frontend-lib";
import { getBrightnessBarHTML } from "./brightness_bar";
import { ULButtons, ULUpperButtons, isPressed } from "./buttons";
import { Settings } from "./settings";

declare global {
  interface Window {
    BrightnessBarWindow: Window | undefined;
  }
}

export class Logic {
  serverAPI: ServerAPI;
  settings: Settings;

  currentBrightness = 0;
  triggeredAt: number = Date.now();

  qamOrSteamButtonPressed = false;
  brightnessBarVisible = false;
  displayingToast = false;

  constructor(serverAPI: ServerAPI, settings: Settings) {
    this.serverAPI = serverAPI;
    this.settings = settings;
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Used to bring Steam UI to the front.
   * When playing a game, brightness bar doesn't show up unless the Steam UI is visible.
   */
  async showInvisibleToast() {
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
   * Listens to controller state changes and sets the `qamOrSteamButtonPressed` flag.
   */
  onControllerStateChange(changes: any[]) {
    for (const inputs of changes) {
      this.qamOrSteamButtonPressed =
        isPressed(ULUpperButtons.QAM, inputs.ulUpperButtons) ||
        isPressed(ULButtons.STEAM, inputs.ulButtons);
    }
  }

  /**
   * Listens to brightness changes and displays the brightness bar
   * if the QAM or Steam button is pressed.
   */
  async onBrightnessChange(data: { flBrightness: number }) {
    // 'tis to prevent the brightness bar from showing up when the brightness automatically changes
    if (!this.qamOrSteamButtonPressed) return;

    this.currentBrightness = Math.round(data.flBrightness * 100);
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

            win.document.body.innerHTML = await getBrightnessBarHTML({
              settings: this.settings,
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
    win.document.body.innerHTML = await getBrightnessBarHTML({
      settings: this.settings,
      brightness: this.currentBrightness,
      animate: true,
    });

    this.brightnessBarVisible = true;
    this.showInvisibleToast();

    view.SetVisible(true);

    await this.delay(animDuration);

    // update the brightness without animation
    win.document.body.innerHTML = await getBrightnessBarHTML({
      settings: this.settings,
      brightness: this.currentBrightness,
      animate: false,
    });

    await this.delay(displayDuration);

    while (Date.now() - this.triggeredAt < displayDuration) {
      await this.delay(displayDuration);
    }

    // hide the brightness bar with animation
    win.document.body.innerHTML = await getBrightnessBarHTML({
      settings: this.settings,
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
