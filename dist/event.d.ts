import { BaseEvent, Face, Object3D, Object3DEventMap, Quaternion, Vector2, Vector3 } from 'three';
import { Intersection } from './intersections/index.js';
import { Pointer, PointerCaptureTarget } from './pointer.js';
export type PointerEventsMap = {
    [Key in keyof PointerEventsHandlers as EventHandlerToEventName<Key>]-?: PointerEventsHandlers[Key];
};
export type EventHandlerToEventName<T> = T extends `on${infer K}` ? Lowercase<K> : never;
export type PointerEventsHandlers = {
    onPointerMove?: PointerEvent;
    onPointerCancel?: PointerEvent;
    onPointerDown?: PointerEvent;
    onPointerUp?: PointerEvent;
    onPointerEnter?: PointerEvent;
    onPointerLeave?: PointerEvent;
    onPointerOver?: PointerEvent;
    onPointerOut?: PointerEvent;
    onClick?: PointerEvent<MouseEvent>;
    onDblClick?: PointerEvent<MouseEvent>;
    onContextMenu?: PointerEvent<MouseEvent>;
    onWheel?: WheelEvent;
};
export type NativeEvent = {
    timeStamp: number;
    shiftKey?: boolean;
    metaKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    button?: number;
};
export declare class PointerEvent<E extends NativeEvent = globalThis.PointerEvent> implements Intersection, BaseEvent<keyof PointerEventsMap> {
    readonly type: keyof PointerEventsMap;
    readonly bubbles: boolean;
    readonly nativeEvent: E;
    private pointer;
    private readonly intersection;
    readonly target: Object3D & PointerCaptureTarget;
    readonly currentTarget: Object3D & PointerCaptureTarget;
    get pointerId(): number;
    get pointerType(): string;
    get pointerState(): any;
    get timeStamp(): number;
    get shiftKey(): boolean;
    get metaKey(): boolean;
    get ctrlKey(): boolean;
    get altKey(): boolean;
    get distance(): number;
    get distanceToRay(): number | undefined;
    get point(): Vector3;
    get index(): number | undefined;
    get face(): Face | null | undefined;
    get faceIndex(): number | undefined;
    get uv(): Vector2 | undefined;
    get uv1(): Vector2 | undefined;
    get normal(): Vector3 | undefined;
    get instanceId(): number | undefined;
    get pointOnLine(): Vector3 | undefined;
    get batchId(): number | undefined;
    get pointerPosition(): Vector3;
    get pointerQuaternion(): Quaternion;
    get pointOnFace(): Vector3;
    get localPoint(): Vector3;
    get details(): Intersection['details'];
    /** same as target */
    get object(): Object3D;
    /** same as currentTarget */
    get currentObject(): Object3D<Object3DEventMap & PointerEventsMap>;
    stopPropagation: () => void;
    stopImmediatePropagation: () => void;
    constructor(type: keyof PointerEventsMap, bubbles: boolean, nativeEvent: E, pointer: Pointer, intersection: Intersection, currentObject?: Object3D, target?: Object3D & PointerCaptureTarget);
    /**
     * for internal use
     */
    retarget(currentObject: Object3D): PointerEvent<E>;
}
export type NativeWheelEvent = {
    deltaX: number;
    deltaY: number;
    deltaZ: number;
} & NativeEvent;
export declare class WheelEvent extends PointerEvent<NativeWheelEvent> {
    get deltaX(): number;
    get deltaY(): number;
    get deltaZ(): number;
    constructor(nativeEvent: NativeWheelEvent, pointer: Pointer, intersection: Intersection);
}
export declare function emitPointerEvent(event: PointerEvent<NativeEvent>): void;
