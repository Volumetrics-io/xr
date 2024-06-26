import { Object3D } from 'three';
import { PointerEventsMap } from './event.js';
declare module 'three' {
    interface Object3D {
        __r3f?: {
            eventCount: number;
            handlers: Record<string, ((e: any) => void) | undefined>;
        };
    }
}
export declare function hasObjectListeners({ _listeners, __r3f }: Object3D): boolean;
export declare function getObjectListeners<E>({ _listeners, __r3f }: Object3D, forEvent: keyof PointerEventsMap): Array<(event: E) => void> | undefined;
