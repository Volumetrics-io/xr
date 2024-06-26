import { Object3D } from 'three';
import { Intersection } from './intersections/index.js';
import { NativeEvent, NativeWheelEvent } from './event.js';
declare const buttonsDownTimeKey: unique symbol;
declare const buttonsClickTimeKey: unique symbol;
export type AllowedPointerEvents = 'none' | 'auto' | 'listener';
export type ButtonsTime = Map<number, number>;
export type AllowedPointerEventsType = 'all' | ((type: string) => boolean) | {
    allow: string | Array<string>;
} | {
    deny: string | Array<string>;
};
declare module 'three' {
    interface Object3D {
        _listeners?: Record<string, Array<(event: unknown) => void> | undefined>;
        /**
         * @default "listener"
         */
        pointerEvents?: AllowedPointerEvents;
        /**
         * @default "all"
         */
        pointerEventsType?: AllowedPointerEventsType;
        [buttonsDownTimeKey]?: ButtonsTime;
        [buttonsClickTimeKey]?: ButtonsTime;
    }
}
export type PointerCapture = {
    object: Object3D;
    intersection: Intersection;
};
export type PointerCaptureTarget = {
    hasPointerCapture(): boolean;
    releasePointerCapture(): void;
    setPointerCapture(): void;
};
export type PointerOptions = {
    /**
     * @default 300
     */
    clickThesholdMs?: number;
    /**
     * @default 500
     */
    dblClickThresholdMs?: number;
    /**
     * @default 2
     */
    contextMenuButton?: number;
};
export declare class Pointer {
    readonly id: number;
    readonly type: string;
    readonly state: any;
    private readonly computeIntersection;
    private readonly onMoveCommited?;
    private readonly setPointerCapture?;
    private readonly releasePointerCapture?;
    private readonly options;
    private prevIntersection;
    private intersection;
    private prevEnabled;
    private enabled;
    /**
     * ordered leaf -> root (bottom -> top)
     */
    private pointerEntered;
    private pointerEnteredHelper;
    private pointerCapture;
    private buttonsDownTime;
    private readonly buttonsDown;
    private wasMoved;
    private onFirstMove;
    constructor(id: number, type: string, state: any, computeIntersection: (scene: Object3D, nativeEvent: unknown, pointerCapture: PointerCapture | undefined) => Intersection | undefined, onMoveCommited?: ((pointer: Pointer) => void) | undefined, setPointerCapture?: ((nativeEven: NativeEvent) => void) | undefined, releasePointerCapture?: ((nativeEven: NativeEvent) => void) | undefined, options?: PointerOptions);
    getButtonsDown(): ReadonlySet<number>;
    getIntersection(): Intersection | undefined;
    getEnabled(): boolean;
    setEnabled(enabled: boolean, nativeEvent: NativeEvent, commit?: boolean): void;
    createPointerCaptureTarget(nativeEvent: NativeEvent, object: Object3D, intersection: Intersection): PointerCaptureTarget;
    /**
     * allows to separately compute and afterwards commit a move
     * => do not forget to call commitMove after computeMove
     * can be used to compute the current intersection and disable or enable the pointer before commiting the move
     */
    computeMove(scene: Object3D, nativeEvent: NativeEvent): void;
    commit(nativeEvent: NativeEvent): void;
    /**
     * computes and commits a move
     */
    move(scene: Object3D, nativeEvent: NativeEvent): void;
    down(nativeEvent: NativeEvent & {
        button: number;
    }): void;
    up(nativeEvent: NativeEvent & {
        button: number;
    }): void;
    cancel(nativeEvent: NativeEvent): void;
    wheel(scene: Object3D, nativeEvent: NativeWheelEvent, useCurrentIntersection: boolean): void;
    exit(nativeEvent: NativeEvent): void;
}
export {};
