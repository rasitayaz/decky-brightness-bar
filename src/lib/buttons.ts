export enum ULButtons {
  R2 = 0,
  L2 = 1,
  R1 = 2,
  L1 = 3,
  Y = 4,
  B = 5,
  X = 6,
  A = 7,
  UP = 8,
  RIGHT = 9,
  LEFT = 10,
  DOWN = 11,
  SELECT = 12,
  STEAM = 13,
  START = 14,
  L5 = 15,
  R5 = 16,
  L3 = 22,
  R3 = 26,
}

export enum ULUpperButtons {
  L4 = 9,
  R4 = 10,
  L3 = 14,
  R3 = 15,
  QAM = 18,
}

export function isPressed(
  buttonId: ULButtons | ULUpperButtons,
  buttons: number
) {
  return buttons && buttons & (1 << buttonId);
}

// example usage:

/* let triggeredAt: number = Date.now();

async function onControllerStateChange(val: any[], serverAPI: ServerAPI) {
  for (const inputs of val) {
    if (Date.now() - triggeredAt < 200) {
      continue;
    }

    if (
      isPressed(ULUpperButtons.QAM, inputs.ulUpperButtons) ||
      isPressed(ULButtons.STEAM, inputs.ulButtons)
    ) {
      if (inputs.sLeftStickY > 16000 || inputs.sLeftStickY < -16000) {
        triggeredAt = Date.now();
        console.log("brightness change");
      }
    }
  }
} */
