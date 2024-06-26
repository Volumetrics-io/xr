import { Vector2 } from 'three';
export function createUpdateXRControllerVisuals(model, layout, gamepadState) {
    const updateVisuals = [];
    for (const componentName in layout.components) {
        const component = layout.components[componentName];
        let state = gamepadState[componentName];
        if (state == null) {
            gamepadState[componentName] = state = {
                state: 'default',
            };
        }
        updateVisuals.push(...Object.values(component.visualResponses).map((visualResponse) => createUpdateVisualResponse(model, state, visualResponse)));
    }
    return () => {
        const length = updateVisuals.length;
        for (let i = 0; i < length; i++) {
            updateVisuals[i]();
        }
    };
}
function createUpdateVisualResponse(model, componentState, visualResponse) {
    const valueNode = model.getObjectByName(visualResponse.valueNodeName);
    componentState.object = valueNode;
    if (valueNode == null) {
        return () => { };
    }
    if (visualResponse.valueNodeProperty === 'visibility') {
        return () => (valueNode.visible = visualResponse.states.includes(componentState.state));
    }
    const minNode = model.getObjectByName(visualResponse.minNodeName);
    const maxNode = model.getObjectByName(visualResponse.maxNodeName);
    if (minNode == null || maxNode == null) {
        return () => { };
    }
    return () => {
        const value = getVisualReponseValue(componentState, visualResponse);
        valueNode.quaternion.slerpQuaternions(minNode.quaternion, maxNode.quaternion, value);
        valueNode.position.lerpVectors(minNode.position, maxNode.position, value);
        valueNode.updateMatrix();
    };
}
/**
 * @returns a value between 0 and 1
 */
function getVisualReponseValue(componentState, { componentProperty, states }) {
    const stateIsActive = states.includes(componentState.state);
    switch (componentProperty) {
        case 'xAxis':
            return stateIsActive ? getNormalizesAxis(componentState).x : 0.5;
        case 'yAxis':
            return stateIsActive ? getNormalizesAxis(componentState).y : 0.5;
        case 'button':
            return stateIsActive ? componentState.button ?? 0 : 0;
        case 'state':
            return stateIsActive ? 1.0 : 0.0;
    }
}
const vector2Helper = new Vector2();
/**
 * project the point (x: [-1, 1], y: [-1, 1]) onto a circle
 */
function getNormalizesAxis({ xAxis = 0, yAxis = 0 }) {
    const hypotenuse = vector2Helper.lengthSq(); //we can use the length squared since "1 * 1 = 1"
    if (hypotenuse > 1) {
        const theta = Math.atan2(yAxis, xAxis);
        vector2Helper.set(Math.cos(theta), Math.sin(theta));
    }
    else {
        //point is inside the circle
        vector2Helper.set(xAxis, yAxis);
    }
    vector2Helper.multiplyScalar(0.5).addScalar(0.5);
    return vector2Helper;
}
