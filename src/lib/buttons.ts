// example usage:

/* async function onControllerStateChange(changes: any[]) {
  for (const inputs of changes) {
    if (
      isPressed(ULUpperButtons.QAM, inputs.ulUpperButtons) &&
      isPressed(ULButtons.Steam, inputs.ulButtons)
    ) {
      console.log("QAM and Steam buttons are pressed");
    }
  }
} */

export enum ULButtons {
  R2 = 0,
  L2 = 1,
  R1 = 2,
  L1 = 3,
  Y = 4,
  B = 5,
  X = 6,
  A = 7,
  Up = 8,
  Right = 9,
  Left = 10,
  Down = 11,
  Select = 12,
  Steam = 13,
  Start = 14,
  L5 = 15,
  R5 = 16,
  LeftTrackpadTouch = 19,
  RightTrackpadTouch = 20,
  LSClick = 22,
  RSClick = 26,
}

export enum ULUpperButtons {
  L4 = 9,
  R4 = 10,
  LSTouch = 14,
  RSTouch = 15,
  QAM = 18,
}

export function isPressed(
  buttonId: ULButtons | ULUpperButtons,
  buttons: number
) {
  return buttons && buttons & (1 << buttonId) ? true : false;
}
