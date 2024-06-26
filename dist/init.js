export function buildXRSessionInit({ anchors = true, handTracking = true, layers = true, meshDetection = true, planeDetection = true, referenceSpaceType = 'local-floor', customSessionInit, depthSensing = false, } = {}) {
    if (customSessionInit != null) {
        return customSessionInit;
    }
    const requiredFeatures = [referenceSpaceType];
    const optionalFeatures = [];
    addXRSessionFeature(anchors, 'anchors', requiredFeatures, optionalFeatures);
    addXRSessionFeature(handTracking, 'hand-tracking', requiredFeatures, optionalFeatures);
    addXRSessionFeature(layers, 'layers', requiredFeatures, optionalFeatures);
    addXRSessionFeature(meshDetection, 'mesh-detection', requiredFeatures, optionalFeatures);
    addXRSessionFeature(planeDetection, 'plane-detection', requiredFeatures, optionalFeatures);
    addXRSessionFeature(depthSensing, 'depth-sensing', requiredFeatures, optionalFeatures);
    return {
        requiredFeatures,
        optionalFeatures,
    };
}
function addXRSessionFeature(value, key, requiredFeatures, optionalFeatures) {
    if (value === false) {
        return;
    }
    if (value === true) {
        optionalFeatures.push(key);
        return;
    }
    requiredFeatures.push(key);
}
