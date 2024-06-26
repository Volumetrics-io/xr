/// <reference types="webxr" />
import { Pointer } from '@pmndrs/pointer-events';
export declare function bindPointerXRSessionEvent(pointer: Pointer, session: XRSession, inputSource: XRInputSource, event: 'select' | 'squeeze', missingEvents?: ReadonlyArray<XRInputSourceEvent>, options?: {
    button?: number;
}): () => void;
