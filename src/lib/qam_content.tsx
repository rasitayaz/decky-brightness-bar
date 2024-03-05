import {
  ButtonItem,
  ColorPickerModal,
  Navigation,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  showModal,
} from "decky-frontend-lib";
import { VFC } from "react";

import Color from "color";
import logo from "../../assets/logo.png";

export const QAMContent: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
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

  const barColor = Color("#1a9fff");
  const barColorHSLArray = barColor.hsl().array();

  return (
    <PanelSection title="Customization">
      <PanelSectionRow>
        <ButtonItem
          onClick={() =>
            showModal(
              <ColorPickerModal
                onConfirm={(HSLString) => {
                  console.log("HSLString", HSLString);
                  // setComponentAndReload(HSLString);
                }}
                defaultH={barColorHSLArray[0]}
                defaultS={barColorHSLArray[1]}
                defaultL={barColorHSLArray[2]}
                defaultA={barColorHSLArray[3] ?? 1}
                title="Bar Color"
                closeModal={() => {}}
              />
            )
          }
          layout={"below"}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>Bar Color</span>
            <div
              style={{
                marginLeft: "auto",
                width: "24px",
                height: "24px",
                backgroundColor: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: barColor.hsl().string(),
                  width: "20px",
                  height: "20px",
                }}
              />
            </div>
          </div>
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={async () => {
            serverAPI.toaster.toast({
              title: "brightness",
              body: `no`,
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
