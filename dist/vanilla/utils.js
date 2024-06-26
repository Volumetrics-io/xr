import { xrUpdatesListContext } from './elements.js';
export function onXRFrame(fn) {
    if (xrUpdatesListContext == null) {
        throw new Error(`XR instances can only be created inside definitions of implementations`);
    }
    xrUpdatesListContext.push(fn);
}
const provideReferenceSpaceSymbol = Symbol('provide-xr-space');
export function setupConsumeReferenceSpace(object) {
    let referenceSpace;
    return () => {
        if (referenceSpace == null) {
            referenceSpace = getReferenceSpaceFromAncestors(object);
            if (referenceSpace == null) {
                throw new Error(`this ${object} can only be rendered as a descendant of a XROrigin`);
            }
        }
        return typeof referenceSpace === 'function' ? referenceSpace() : referenceSpace;
    };
}
export function setupProvideReferenceSpace(object, space) {
    object[provideReferenceSpaceSymbol] = space;
}
function getReferenceSpaceFromAncestors({ parent }) {
    if (parent == null) {
        return undefined;
    }
    if (provideReferenceSpaceSymbol in parent) {
        return parent[provideReferenceSpaceSymbol];
    }
    return getReferenceSpaceFromAncestors(parent);
}
