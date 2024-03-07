import {
  ButtonItem,
  ColorPickerModal,
  PanelSection,
  PanelSectionRow,
  SliderField,
  ToggleField,
  showModal,
} from "decky-frontend-lib";
import { VFC, useEffect, useState } from "react";

import Color from "color";
import { context } from "./context";
import { Setting } from "./settings";

export const QAMContent: VFC = () => {
  const { settings } = context;

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

  const containerRadiusOptions = ["0px", "5px", "10px", "15px", "20px", "30px"];

  useEffect(() => {
    settings.load(Setting.BarColor).then(setBarColor);
    settings.load(Setting.EmptyBarColor).then(setEmptyBarColor);
    settings.load(Setting.ContainerColor).then(setContainerColor);
    settings.load(Setting.IconColor).then(setIconColor);
    settings.load(Setting.ContainerRadius).then(setContainerRadius);
    settings.load(Setting.ContainerShadow).then(setContainerShadow);
  }, []);

  return (
    <PanelSection title="Customization">
      <ColorPickerRow
        title="Bar Color"
        color={barColor}
        onSave={(color) => settings.save(Setting.BarColor, color)}
      />

      <ColorPickerRow
        title="Empty Bar Color"
        color={emptyBarColor}
        onSave={(color) => settings.save(Setting.EmptyBarColor, color)}
      />

      <ColorPickerRow
        title="Container Color"
        color={containerColor}
        onSave={(color) => settings.save(Setting.ContainerColor, color)}
      />

      <ColorPickerRow
        title="Icon Color"
        color={iconColor}
        onSave={(color) => settings.save(Setting.IconColor, color)}
      />

      <PanelSectionRow>
        <SliderField
          bottomSeparator="none"
          label={"Container Radius"}
          min={0}
          max={containerRadiusOptions.length - 1}
          value={containerRadiusOptions.indexOf(containerRadius)}
          onChange={(value) => {
            const newRadius = containerRadiusOptions[value];
            settings.save(Setting.ContainerRadius, newRadius);
            setContainerRadius(newRadius);
          }}
          notchCount={containerRadiusOptions.length}
          notchLabels={containerRadiusOptions.map((e, i) => ({
            notchIndex: i,
            label: e,
            value: i,
          }))}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <ToggleField
          bottomSeparator="none"
          label={"Container Shadow"}
          checked={containerShadow}
          onChange={(value) => {
            settings.save(Setting.ContainerShadow, value);
            setContainerShadow(value);
          }}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          bottomSeparator="none"
          layout="below"
          onClick={() => {
            settings.resetToDefaults();
            setBarColor(settings.defaults.barColor);
            setEmptyBarColor(settings.defaults.emptyBarColor);
            setContainerColor(settings.defaults.containerColor);
            setIconColor(settings.defaults.iconColor);
            setContainerRadius(settings.defaults.containerRadius);
            setContainerShadow(settings.defaults.containerShadow);
          }}
        >
          Reset to Defaults
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

const ColorPickerRow: VFC<{
  title: string;
  color: string;
  onSave: (color: string) => void;
}> = ({ title, color, onSave }) => {
  const hslArray = Color(color).hsl().array();

  return (
    <PanelSectionRow>
      <ButtonItem
        bottomSeparator="none"
        onClick={() =>
          showModal(
            <ColorPickerModal
              onConfirm={(HSLString) => {
                onSave(Color(HSLString).hexa());
              }}
              defaultH={hslArray[0]}
              defaultS={hslArray[1]}
              defaultL={hslArray[2]}
              defaultA={hslArray[3] ?? 1}
              title={title}
              closeModal={() => {}}
            />
          )
        }
        layout={"below"}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{title}</span>
          <div
            style={{
              marginLeft: "auto",
              width: "20px",
              height: "20px",
              backgroundColor: color,
              border: "2px solid #000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
      </ButtonItem>
    </PanelSectionRow>
  );
};
