import { PointerEvent, WheelEvent, emitPointerEvent } from './event.js';
const buttonsDownTimeKey = Symbol('buttonsDownTime');
const buttonsClickTimeKey = Symbol('buttonsClickTime');
export class Pointer {
    id;
    type;
    state;
    computeIntersection;
    onMoveCommited;
    setPointerCapture;
    releasePointerCapture;
    options;
    //state
    prevIntersection;
    intersection;
    prevEnabled = true;
    enabled = true;
    //derived state
    /**
     * ordered leaf -> root (bottom -> top)
     */
    pointerEntered = [];
    pointerEnteredHelper = [];
    pointerCapture;
    buttonsDownTime = new Map();
    buttonsDown = new Set();
    //to handle interaction before first move
    wasMoved = false;
    onFirstMove = [];
    constructor(id, type, state, computeIntersection, onMoveCommited, setPointerCapture, releasePointerCapture, options = {}) {
        this.id = id;
        this.type = type;
        this.state = state;
        this.computeIntersection = computeIntersection;
        this.onMoveCommited = onMoveCommited;
        this.setPointerCapture = setPointerCapture;
        this.releasePointerCapture = releasePointerCapture;
        this.options = options;
    }
    getButtonsDown() {
        return this.buttonsDown;
    }
    getIntersection() {
        return this.intersection;
    }
    getEnabled() {
        return this.enabled;
    }
    setEnabled(enabled, nativeEvent, commit = true) {
        if (this.enabled === enabled) {
            return;
        }
        if (!enabled && this.pointerCapture != null) {
            this.releasePointerCapture?.(nativeEvent);
            this.pointerCapture = undefined;
        }
        this.enabled = enabled;
        if (commit) {
            this.commit(nativeEvent);
        }
    }
    createPointerCaptureTarget(nativeEvent, object, intersection) {
        const hasPointerCapture = () => this.pointerCapture?.intersection === intersection && this.pointerCapture.object === object;
        return {
            hasPointerCapture,
            releasePointerCapture: () => {
                if (!hasPointerCapture()) {
                    return;
                }
                this.releasePointerCapture?.(nativeEvent);
                this.pointerCapture = undefined;
            },
            setPointerCapture: () => {
                this.setPointerCapture?.(nativeEvent);
                this.pointerCapture = { object, intersection };
            },
        };
    }
    /**
     * allows to separately compute and afterwards commit a move
     * => do not forget to call commitMove after computeMove
     * can be used to compute the current intersection and disable or enable the pointer before commiting the move
     */
    computeMove(scene, nativeEvent) {
        this.intersection = this.computeIntersection(scene, nativeEvent, this.pointerCapture);
    }
    commit(nativeEvent) {
        const prevIntersection = this.prevEnabled ? this.prevIntersection : undefined;
        const intersection = this.enabled ? this.intersection : undefined;
        //pointer out
        if (prevIntersection != null && prevIntersection.object != intersection?.object) {
            emitPointerEvent(new PointerEvent('pointerout', true, nativeEvent, this, prevIntersection));
        }
        const pointerLeft = this.pointerEntered;
        this.pointerEntered = [];
        this.pointerEnteredHelper.length = 0;
        computeEnterLeave(intersection?.object, this.pointerEntered, pointerLeft, this.pointerEnteredHelper);
        //pointerleave
        const length = pointerLeft.length;
        for (let i = 0; i < length; i++) {
            const object = pointerLeft[i];
            emitPointerEvent(new PointerEvent('pointerleave', false, nativeEvent, this, prevIntersection, object));
        }
        //pointer over
        if (intersection != null && prevIntersection?.object != intersection.object) {
            emitPointerEvent(new PointerEvent('pointerover', true, nativeEvent, this, intersection));
        }
        //pointer enter
        //inverse loop so that we emit enter from top -> bottom (root -> leaf)
        for (let i = this.pointerEnteredHelper.length - 1; i >= 0; i--) {
            const object = this.pointerEnteredHelper[i];
            emitPointerEvent(new PointerEvent('pointerenter', false, nativeEvent, this, intersection, object));
        }
        //pointer move
        if (intersection != null) {
            emitPointerEvent(new PointerEvent('pointermove', true, nativeEvent, this, intersection));
        }
        this.prevIntersection = this.intersection;
        this.prevEnabled = this.enabled;
        if (!this.wasMoved) {
            this.wasMoved = true;
            const length = this.onFirstMove.length;
            for (let i = 0; i < length; i++) {
                this.onFirstMove[i]();
            }
            this.onFirstMove.length = 0;
        }
        this.onMoveCommited?.(this);
    }
    /**
     * computes and commits a move
     */
    move(scene, nativeEvent) {
        this.computeMove(scene, nativeEvent);
        this.commit(nativeEvent);
    }
    down(nativeEvent) {
        if (!this.enabled) {
            return;
        }
        if (!this.wasMoved) {
            this.onFirstMove.push(this.down.bind(this, nativeEvent));
            return;
        }
        this.buttonsDown.add(nativeEvent.button);
        if (this.intersection == null) {
            return;
        }
        //pointer down
        emitPointerEvent(new PointerEvent('pointerdown', true, nativeEvent, this, this.intersection));
        //store button down times on object and on pointer
        const { object } = this.intersection;
        object[buttonsDownTimeKey] ??= new Map();
        object[buttonsDownTimeKey].set(nativeEvent.button, nativeEvent.timeStamp);
        this.buttonsDownTime.set(nativeEvent.button, nativeEvent.timeStamp);
    }
    up(nativeEvent) {
        if (!this.enabled) {
            return;
        }
        if (!this.wasMoved) {
            this.onFirstMove.push(this.up.bind(this, nativeEvent));
            return;
        }
        this.buttonsDown.delete(nativeEvent.button);
        if (this.intersection == null) {
            return;
        }
        const { contextMenuButton = 2, dblClickThresholdMs = 500, clickThesholdMs = 300 } = this.options;
        this.pointerCapture = undefined;
        const isClicked = getIsClicked(this.buttonsDownTime, this.intersection.object[buttonsDownTimeKey], nativeEvent.button, nativeEvent.timeStamp, clickThesholdMs);
        //context menu
        if (isClicked && nativeEvent.button === contextMenuButton) {
            emitPointerEvent(new PointerEvent('contextmenu', true, nativeEvent, this, this.intersection));
        }
        //poinerup
        emitPointerEvent(new PointerEvent('pointerup', true, nativeEvent, this, this.intersection));
        if (!isClicked || nativeEvent.button === contextMenuButton) {
            return;
        }
        //click
        emitPointerEvent(new PointerEvent('click', true, nativeEvent, this, this.intersection));
        //dblclick
        const { object } = this.intersection;
        const buttonsClickTime = (object[buttonsClickTimeKey] ??= new Map());
        const buttonClickTime = buttonsClickTime.get(nativeEvent.button);
        if (buttonClickTime == null || nativeEvent.timeStamp - buttonClickTime > dblClickThresholdMs) {
            buttonsClickTime.set(nativeEvent.button, nativeEvent.timeStamp);
            return;
        }
        emitPointerEvent(new PointerEvent('dblclick', true, nativeEvent, this, this.intersection));
        buttonsClickTime.delete(nativeEvent.button);
    }
    cancel(nativeEvent) {
        if (!this.enabled) {
            return;
        }
        if (!this.wasMoved) {
            this.onFirstMove.push(this.cancel.bind(this, nativeEvent));
            return;
        }
        if (this.intersection == null) {
            return;
        }
        //pointer cancel
        emitPointerEvent(new PointerEvent('pointercancel', true, nativeEvent, this, this.intersection));
    }
    wheel(scene, nativeEvent, useCurrentIntersection) {
        if (!this.enabled) {
            return;
        }
        let intersection = this.intersection;
        if (!useCurrentIntersection) {
            intersection = this.computeIntersection(scene, nativeEvent, this.pointerCapture);
        }
        if (!this.wasMoved && useCurrentIntersection) {
            this.onFirstMove.push(this.cancel.bind(this, nativeEvent));
            return;
        }
        if (intersection == null) {
            return;
        }
        //wheel
        emitPointerEvent(new WheelEvent(nativeEvent, this, intersection));
    }
    exit(nativeEvent) {
        if (!this.wasMoved) {
            this.onFirstMove.push(this.exit.bind(this, nativeEvent));
            return;
        }
        //reset state
        if (this.pointerCapture != null) {
            this.releasePointerCapture?.(nativeEvent);
            this.pointerCapture = undefined;
        }
        this.intersection = undefined;
        this.commit(nativeEvent);
    }
}
/**
 * @returns an array that contains the object and all its ancestors ordered leaf -> root (bottom -> top)
 */
function computeEnterLeave(currentObject, targetAllAncestors, targeDiffRemovedAncestors, targetDiffAddedAncestors) {
    if (currentObject == null) {
        return;
    }
    const index = targeDiffRemovedAncestors.indexOf(currentObject);
    if (index != -1) {
        targeDiffRemovedAncestors.splice(index, 1);
    }
    else {
        targetDiffAddedAncestors.push(currentObject);
    }
    targetAllAncestors.push(currentObject);
    computeEnterLeave(currentObject.parent, targetAllAncestors, targeDiffRemovedAncestors, targetDiffAddedAncestors);
}
function getIsClicked(pointerButtonsPressTime, objectButtonsDownTime, button, buttonUpTime, clickThesholdMs) {
    if (objectButtonsDownTime == null) {
        return false;
    }
    const objectButtonPressTime = objectButtonsDownTime.get(button);
    if (objectButtonPressTime == null) {
        return false;
    }
    if (buttonUpTime - objectButtonPressTime > clickThesholdMs) {
        return false;
    }
    if (objectButtonPressTime != pointerButtonsPressTime.get(button)) {
        //we have released the button somewhere else
        return false;
    }
    return true;
}
