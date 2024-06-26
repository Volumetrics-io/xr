import { updateXRControllerGamepadState } from './gamepad.js';
export async function createXRControllerState(inputSource, layoutLoader) {
    const layout = await layoutLoader.load(inputSource.profiles, inputSource.handedness);
    const gamepad = {};
    updateXRControllerGamepadState(gamepad, inputSource, layout);
    return {
        inputSource,
        gamepad,
        layout,
    };
}
export function updateXRControllerState({ gamepad, inputSource, layout }) {
    updateXRControllerGamepadState(gamepad, inputSource, layout);
}
