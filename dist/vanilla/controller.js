import { Object3D } from 'three';
import { configureXRControllerModel, loadXRControllerModel } from '../controller/model.js';
import { createUpdateXRControllerVisuals } from '../controller/visual.js';
import { onXRFrame } from './utils.js';
export class XRControllerModel extends Object3D {
    constructor(layout, gamepadState, options) {
        super();
        let update = () => { };
        onXRFrame(() => update());
        loadXRControllerModel(layout).then((model) => {
            this.add(model);
            configureXRControllerModel(model, options);
            update = createUpdateXRControllerVisuals(model, layout, gamepadState);
        });
    }
}
