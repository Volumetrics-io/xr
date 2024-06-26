import { XRControllerLayoutLoader, createXRControllerState, } from './controller/index.js';
import { createXRHandState } from './hand/index.js';
function setupXRTransientPointer(inputSource, session) {
    //for the transient pointer we are recording all events to make sure we don't miss events emitted on XRInputSource creation
    const events = [];
    const listener = (e) => events.push(e);
    session.addEventListener('selectstart', listener);
    session.addEventListener('selectend', listener);
    session.addEventListener('select', listener);
    session.addEventListener('squeeze', listener);
    session.addEventListener('squeezestart', listener);
    session.addEventListener('squeezeend', listener);
    return {
        cleanup() {
            session.removeEventListener('selectstart', listener);
            session.removeEventListener('selectend', listener);
            session.removeEventListener('select', listener);
            session.removeEventListener('squeeze', listener);
            session.removeEventListener('squeezestart', listener);
            session.removeEventListener('squeezeend', listener);
        },
        state: {
            inputSource,
            events,
        },
    };
}
function getXRInputSourceType(inputSource) {
    if (inputSource.hand != null) {
        return 'hand';
    }
    switch (inputSource.targetRayMode) {
        case 'gaze':
            return 'gaze';
        case 'screen':
            return 'screenInput';
        case 'tracked-pointer':
            return 'controller';
        case 'transient-pointer':
            return 'transientPointer';
    }
}
function createXRInputSourceSetupMap(options) {
    const layoutLoader = new XRControllerLayoutLoader(options);
    return {
        controller: async (_session, inputSource) => ({ state: await createXRControllerState(inputSource, layoutLoader) }),
        hand: (_session, inputSource) => ({ state: createXRHandState(inputSource, options) }),
        gaze: (_session, inputSource) => ({ state: { inputSource } }),
        screenInput: (_session, inputSource) => ({ state: { inputSource } }),
        transientPointer: (session, inputSource) => setupXRTransientPointer(inputSource, session),
    };
}
export function createSyncXRInputSourceStates(addAsyncMap, options) {
    let currentInputSources = new Set();
    const setupMap = createXRInputSourceSetupMap(options);
    const cleanupMap = new Map();
    return (session, currentStates, added, removed) => {
        currentInputSources = new Set(session.inputSources);
        const result = {};
        if (removed === 'all') {
            result.controllerStates = [];
            result.gazeStates = [];
            result.handStates = [];
            result.screenInputStates = [];
            result.transientPointerStates = [];
            for (const cleanup of cleanupMap.values()) {
                cleanup();
            }
        }
        else if (removed != null) {
            const removedLength = removed.length;
            for (let i = 0; i < removedLength; i++) {
                const inputSource = removed[i];
                const type = getXRInputSourceType(inputSource);
                const states = getOrCreate(`${type}States`, result, currentStates);
                const index = states.findIndex(({ inputSource: is }) => is === inputSource);
                if (index === -1) {
                    throw new Error(`unable to find removed input source ${inputSource}`);
                }
                states.splice(index, 1);
                cleanupMap.get(inputSource)?.();
                cleanupMap.delete(inputSource);
            }
        }
        if (added != null) {
            added.forEach(async (inputSource) => {
                const type = getXRInputSourceType(inputSource);
                let setupResult = setupMap[type](session, inputSource);
                let resolvedSetupResult;
                if (setupResult instanceof Promise) {
                    resolvedSetupResult = await setupResult;
                    //test if the input source is still part of the session (can happen since the state is loaded asynchrounously)
                    if (!currentInputSources.has(inputSource)) {
                        return;
                    }
                    addAsyncMap[type](resolvedSetupResult.state);
                }
                else {
                    resolvedSetupResult = setupResult;
                    getOrCreate(`${type}States`, result, currentStates).push(resolvedSetupResult.state);
                }
                if (resolvedSetupResult.cleanup != null) {
                    cleanupMap.set(inputSource, resolvedSetupResult.cleanup);
                }
            });
        }
        return result;
    };
}
function getOrCreate(key, result, current) {
    let states = result[key];
    if (states == null) {
        result[key] = states = current == null ? [] : [...current[key]];
    }
    return states;
}
