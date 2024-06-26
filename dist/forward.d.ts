import { Camera, Object3D, Scene } from 'three';
import { PointerOptions } from './pointer.js';
import { NativeEvent } from './event.js';
export type ForwardablePointerEvent = {
    pointerId?: number;
    pointerType?: string;
    pointerState?: any;
} & NativeEvent;
export type ForwardEventsOptions = {
    /**
     * @default true
     */
    forwardPointerCapture?: boolean;
    /**
     * @default "forward-"
     */
    pointerTypePrefix?: string;
} & PointerOptions;
/**
 * sets the `pointerTypePrefix` to `"screen-"`. Therefore, a event with pointerType `touch` is forwarded to the scene as `"screen-touch"`
 */
export declare function forwardHtmlEvents(fromElement: HTMLElement, toCamera: Camera, toScene: Object3D, options?: ForwardEventsOptions): () => void;
export declare function forwardObjectEvents(fromPortal: Object3D, toCamera: Camera, toScene: Scene, options?: ForwardEventsOptions): () => void;
