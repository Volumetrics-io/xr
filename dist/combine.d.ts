import { Object3D } from 'three';
import { NativeEvent } from './event.js';
import { Pointer } from './pointer.js';
export declare class CombinedPointer {
    private pointers;
    private isDefaults;
    private enabled;
    register(pointer: Pointer, isDefault: boolean): () => void;
    private unregister;
    move(scene: Object3D, nativeEvent: NativeEvent): void;
    setEnabled(enabled: boolean, nativeEvent: NativeEvent): void;
}
