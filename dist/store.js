import { createStore } from 'zustand/vanilla';
import { updateXRHandState } from './hand/state.js';
import { updateXRControllerState } from './controller/index.js';
import { createSyncXRInputSourceStates } from './input.js';
import { buildXRSessionInit } from './init.js';
export function resolveInputSourceImplementation(implementation, handedness, defaultValue) {
    if (implementation === false) {
        return false;
    }
    if (typeof implementation === 'function') {
        return implementation;
    }
    if (hasKey(implementation, handedness)) {
        return implementation[handedness] ?? defaultValue;
    }
    if ('default' in implementation) {
        return implementation.default ?? defaultValue;
    }
    return implementation;
}
function hasKey(val, key) {
    return key in val;
}
export function resolveDetectedImplementation(implementation, semanticLabel, defaultValue) {
    if (implementation === false) {
        return false;
    }
    if (typeof implementation === 'function') {
        return implementation;
    }
    if (semanticLabel != null && semanticLabel in implementation) {
        return implementation[semanticLabel] ?? defaultValue;
    }
    if ('default' in implementation) {
        return implementation.default ?? defaultValue;
    }
    return implementation;
}
const defaultPoseUrls = {};
const baseInitialState = {
    handStates: [],
    hand: {},
    controllerStates: [],
    controller: {},
    transientPointerStates: [],
    transientPointer: {},
    gazeStates: [],
    gaze: {},
    screenInputStates: [],
    screenInput: {},
    detectedMeshes: [],
    detectedMesh: false,
    detectedPlanes: [],
    detectedPlane: false,
    mode: null,
};
export function createXRStore(options) {
    //TODO nextFrameCallbacks for anchors
    const handPoseUrls = options?.handPoseUrls ?? defaultPoseUrls;
    const store = createStore(() => ({
        ...baseInitialState,
        controller: options?.controller ?? baseInitialState.controller,
        hand: options?.hand ?? baseInitialState.hand,
        gaze: options?.gaze ?? baseInitialState.gaze,
        screenInput: options?.screenInput ?? baseInitialState.screenInput,
        transientPointer: options?.transientPointer ?? baseInitialState.transientPointer,
        detectedMesh: options?.detectedMesh ?? baseInitialState.detectedMesh,
        detectedPlane: options?.detectedPlane ?? baseInitialState.detectedPlane,
    }));
    const syncXRInputSourceStates = createSyncXRInputSourceStates({
        controller: (state) => store.setState({ controllerStates: [...store.getState().controllerStates, state] }),
    }, options);
    const bindToSession = createBindToSession(store, syncXRInputSourceStates);
    const cleanupSessionGrantedListener = setupSessionGrantedListener(options?.enterGrantedSession, (mode) => enterXR(mode, options, undefined, webxrManager));
    let cleanupSessionStartListener;
    let webxrManager;
    return Object.assign(store, {
        setWebXRManager(manager) {
            if (webxrManager === manager) {
                return;
            }
            webxrManager = manager;
            const { referenceSpaceType = 'local-floor', foveation } = options ?? {};
            webxrManager.setReferenceSpaceType(referenceSpaceType);
            if (foveation != null) {
                webxrManager.setFoveation(foveation);
            }
            cleanupSessionStartListener?.();
            cleanupSessionStartListener = setupSessionStartListener(manager, bindToSession);
        },
        setFrameRate(value) {
            const { session } = store.getState();
            if (session == null) {
                return;
            }
            setFrameRate(session, value);
        },
        setHand(implementation, handedness) {
            if (handedness == null) {
                store.setState({ hand: implementation });
                return;
            }
            //TODO
        },
        setController(implementation, handedness) {
            if (handedness == null) {
                store.setState({ controller: implementation });
                return;
            }
            //TODO
        },
        setTransientPointer(implementation, handedness) {
            if (handedness == null) {
                store.setState({ transientPointer: implementation });
                return;
            }
            //TODO
        },
        setGaze(implementation) {
            store.setState({ gaze: implementation });
        },
        setScreenInput(implementation) {
            store.setState({ screenInput: implementation });
        },
        setDetectedPlane(implementation, semanticLabel) {
            if (semanticLabel == null) {
                store.setState({ detectedPlane: implementation });
                return;
            }
            //TODO
        },
        setDetectedMesh(implementation, semanticLabel) {
            if (semanticLabel == null) {
                store.setState({ detectedMesh: implementation });
                return;
            }
            //TODO
        },
        destroy() {
            cleanupSessionStartListener?.();
            cleanupSessionGrantedListener?.();
            //unbinding the session
            bindToSession(undefined, undefined);
        },
        enterAR: (enterOptions) => enterXR('immersive-ar', options, enterOptions, webxrManager),
        enterVR: (enterOptions) => enterXR('immersive-vr', options, enterOptions, webxrManager),
        onBeforeFrame(scene, camera, frame) {
            //update origin
            const { origin: oldOrigin } = store.getState();
            const origin = camera.parent ?? scene;
            if (oldOrigin != origin) {
                store.setState({ origin });
            }
            if (webxrManager != null) {
                updateSession(store, frame, webxrManager, handPoseUrls);
            }
        },
    });
}
async function setFrameRate(session, frameRate) {
    if (frameRate === false) {
        return;
    }
    const { supportedFrameRates } = session;
    if (supportedFrameRates == null || supportedFrameRates.length === 0) {
        return;
    }
    if (typeof frameRate === 'function') {
        const value = frameRate(supportedFrameRates);
        if (value === false) {
            return;
        }
        return session.updateTargetFrameRate(value);
    }
    const multiplier = frameRate === 'high' ? 1 : frameRate === 'mid' ? 0.5 : 0;
    return session.updateTargetFrameRate(supportedFrameRates[Math.ceil((supportedFrameRates.length - 1) * multiplier)]);
}
async function enterXR(mode, options, initOptions, xr) {
    if (navigator.xr == null) {
        throw new Error(`xr not supported`);
    }
    const session = await navigator.xr.requestSession(mode, buildXRSessionInit(Object.assign({}, options, initOptions)));
    setFrameRate(session, options?.frameRate ?? 'high');
    //in here is the only place we can configure the frame buffer scaling right now (because of threejs)
    const maxFrameBufferScalingFactor = XRWebGLLayer.getNativeFramebufferScaleFactor(session);
    let frameBufferScaling = options?.frameBufferScaling ?? false;
    if (typeof frameBufferScaling === 'function') {
        frameBufferScaling = frameBufferScaling(maxFrameBufferScalingFactor);
    }
    if (typeof frameBufferScaling === 'string') {
        frameBufferScaling =
            frameBufferScaling === 'high' ? maxFrameBufferScalingFactor : frameBufferScaling === 'mid' ? 1 : 0.5;
    }
    if (frameBufferScaling != false) {
        xr?.setFramebufferScaleFactor(frameBufferScaling);
    }
    xr?.setSession(session);
    return session;
}
const allSessionModes = ['immersive-ar', 'immersive-vr', 'inline'];
function setupSessionStartListener(xr, bindToSession) {
    const sessionStartListener = () => {
        const session = xr.getSession();
        bindToSession(session, session.environmentBlendMode === 'opaque' ? 'immersive-vr' : 'immersive-ar');
    };
    xr.addEventListener('sessionstart', sessionStartListener);
    return () => xr.removeEventListener('sessionstart', sessionStartListener);
}
function setupSessionGrantedListener(enterGrantedSession = allSessionModes, enterXR) {
    if (enterGrantedSession === false) {
        return;
    }
    if (enterGrantedSession === true) {
        enterGrantedSession = allSessionModes;
    }
    const sessionGrantedListener = async () => {
        for (const mode of enterGrantedSession) {
            if (!(await navigator.xr?.isSessionSupported(mode))) {
                continue;
            }
            enterXR(mode);
        }
    };
    navigator.xr?.addEventListener('sessiongranted', sessionGrantedListener);
    return () => navigator.xr?.removeEventListener('sessiongranted', sessionGrantedListener);
}
function createBindToSession(store, syncXRInputSourceStates) {
    let cleanupSession;
    return (session, mode) => {
        cleanupSession?.();
        if (session == null || mode == null) {
            return;
        }
        const onInputSourcesChange = (e) => store.setState(syncXRInputSourceStates(e.session, store.getState(), e.added, e.removed));
        session.addEventListener('inputsourceschange', onInputSourcesChange);
        //event handlers
        //trigger re-render just re-evaluating the values read from the session
        const onChange = () => store.setState({ frameRate: session.frameRate, visibilityState: session.visibilityState });
        const onEnd = () => {
            cleanupSession?.();
            cleanupSession = undefined;
            store.setState(baseInitialState);
        };
        session.addEventListener('end', onEnd);
        session.addEventListener('frameratechange', onChange);
        session.addEventListener('visibilitychange', onChange);
        store.setState({
            ...syncXRInputSourceStates(session, undefined, session.inputSources, undefined),
            frameRate: session.frameRate,
            visibilityState: session.visibilityState,
            detectedMeshes: [],
            detectedPlanes: [],
            mode,
            session,
        });
        cleanupSession = () => {
            //cleanup
            syncXRInputSourceStates(session, store.getState(), undefined, 'all');
            session.removeEventListener('end', onEnd);
            session.removeEventListener('frameratechange', onChange);
            session.removeEventListener('visibilitychange', onChange);
            session.removeEventListener('inputsourceschange', onInputSourcesChange);
        };
    };
}
function updateSession(store, frame, manager, handPoseUrls) {
    const referenceSpace = manager.getReferenceSpace();
    const { detectedMeshes: prevMeshes, detectedPlanes: prevPlanes, session, controllerStates: controllers, handStates: hands, } = store.getState();
    if (frame == null || referenceSpace == null || session == null) {
        //not in a XR session
        return;
    }
    //update detected planes and meshes
    const detectedPlanes = updateDetectedEntities(prevPlanes, frame.detectedPlanes);
    const detectedMeshes = updateDetectedEntities(prevMeshes, frame.detectedMeshes);
    if (prevPlanes != detectedPlanes || prevMeshes != detectedMeshes) {
        store.setState({ detectedPlanes, detectedMeshes });
    }
    //update controllers
    const controllersLength = controllers.length;
    for (let i = 0; i < controllersLength; i++) {
        updateXRControllerState(controllers[i]);
    }
    //update hands
    const handsLength = hands.length;
    for (let i = 0; i < handsLength; i++) {
        updateXRHandState(hands[i], frame, manager, handPoseUrls);
    }
}
const emptyArray = [];
function updateDetectedEntities(prevDetectedEntities, detectedEntities) {
    if (detectedEntities == null) {
        return emptyArray;
    }
    if (prevDetectedEntities != null && equalContent(detectedEntities, prevDetectedEntities)) {
        return prevDetectedEntities;
    }
    return Array.from(detectedEntities);
}
function equalContent(set, arr) {
    if (set.size != arr.length) {
        return false;
    }
    for (const entry of arr) {
        if (!set.has(entry)) {
            return false;
        }
    }
    return true;
}
