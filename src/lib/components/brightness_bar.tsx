import { findModuleChild } from "decky-frontend-lib";
import { VFC, useEffect, useState } from "react";
import { ULButtons, ULUpperButtons, isPressed } from "../utils/buttons";
import { appContext } from "../utils/context";
import { Setting } from "../utils/settings";
import { BrightnessIcon } from "./brightness_icon";

enum UIComposition {
  Hidden = 0,
  Notification = 1,
  Overlay = 2,
  Opaque = 3,
  OverlayKeyboard = 4,
}

type UseUIComposition = (composition: UIComposition) => {
  releaseComposition: () => void;
};

const useUIComposition: UseUIComposition = findModuleChild((m) => {
  if (typeof m !== "object") return undefined;
  for (let prop in m) {
    if (
      typeof m[prop] === "function" &&
      m[prop].toString().includes("AddMinimumCompositionStateRequest") &&
      m[prop].toString().includes("ChangeMinimumCompositionStateRequest") &&
      m[prop].toString().includes("RemoveMinimumCompositionStateRequest") &&
      !m[prop].toString().includes("m_mapCompositionStateRequests")
    ) {
      return m[prop];
    }
  }
});

const UICompositionProxy: VFC = () => {
  useUIComposition(UIComposition.Notification);
  return null;
};

let triggeredAt = 0;
let controllingBrightness = false;
let brightnessLock = false;

export const BrightnessBar: VFC = () => {
  const { settings } = appContext;

  const [barColor, setBarColor] = useState<string>(settings.defaults.barColor);
  const [emptyBarColor, setEmptyBarColor] = useState<string>(
    settings.defaults.emptyBarColor
  );
  const [containerColor, setContainerColor] = useState<string>(
    settings.defaults.containerColor
  );
  const [iconColor, setIconColor] = useState<string>(
    settings.defaults.iconColor
  );
  const [containerRadius, setContainerRadius] = useState<string>(
    settings.defaults.containerRadius
  );
  const [containerShadow, setContainerShadow] = useState<boolean>(
    settings.defaults.containerShadow
  );

  useEffect(() => {
    function loadSettings() {
      settings.load(Setting.BarColor).then(setBarColor);
      settings.load(Setting.EmptyBarColor).then(setEmptyBarColor);
      settings.load(Setting.ContainerColor).then(setContainerColor);
      settings.load(Setting.IconColor).then(setIconColor);
      settings.load(Setting.ContainerRadius).then(setContainerRadius);
      settings.load(Setting.ContainerShadow).then(setContainerShadow);
    }

    loadSettings();
    settings.subscribe("BrightnessBar", loadSettings);

    return () => {
      settings.unsubscribe("BrightnessBar");
    };
  }, []);

  useEffect(() => {
    const registration =
      window.SteamClient.Input.RegisterForControllerStateChanges(
        (changes: any[]) => {
          for (const inputs of changes) {
            const qamOrSteamPressed =
              isPressed(ULUpperButtons.QAM, inputs.ulUpperButtons) ||
              isPressed(ULButtons.Steam, inputs.ulButtons);

            const threshold = 10000;

            const up = inputs.sLeftStickY > threshold;
            const down = inputs.sLeftStickY < -threshold;

            controllingBrightness = qamOrSteamPressed && (up || down);
          }
        }
      );

    return () => {
      registration.unregister();
    };
  }, []);

  const [brightnessPercentage, setBrightnessPercentage] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const registration =
      window.SteamClient.System.Display.RegisterForBrightnessChanges(
        async (data: { flBrightness: number }) => {
          triggeredAt = Date.now();
          setBrightnessPercentage(Math.round(data.flBrightness * 100));

          if (brightnessLock || !controllingBrightness) return;

          brightnessLock = true;

          const displayDuration = 1000;

          setVisible(true);

          while (Date.now() - triggeredAt < displayDuration - 100) {
            await new Promise((resolve) =>
              setTimeout(resolve, displayDuration)
            );
          }

          setVisible(false);

          brightnessLock = false;
        }
      );

    return () => {
      registration.unregister();
    };
  }, []);

  return (
    <div
      id="brightness_bar_container"
      style={{
        marginLeft: 8,
        marginTop: 8,
        width: 236,
        background: containerColor,
        color: iconColor,
        boxShadow:
          visible && containerShadow ? "0px 0px 10px rgb(0 0 0 / 50%)" : "none",
        borderRadius: containerRadius,
        display: "flex",
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        flexWrap: "nowrap",
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 7,
        paddingBottom: 7,
        zIndex: 7001, // volume bar is 7000
        position: "fixed",
        transform: `translateY(${visible ? 0 : -150}%)`,
        transition: "transform 0.22s cubic-bezier(0, 0.73, 0.48, 1)",
      }}
    >
      {visible && <UICompositionProxy />}
      <BrightnessIcon size={20} />
      <div
        id="brightness_bar"
        style={{
          flexGrow: 1,
          height: 6,
          backgroundColor: emptyBarColor,
          borderRadius: 3,
        }}
      >
        <span
          style={{
            display: "block",
            height: "100%",
            width: `${brightnessPercentage}%`,
            backgroundColor: barColor,
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
};
