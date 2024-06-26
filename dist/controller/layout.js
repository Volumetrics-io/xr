import { DefaultAssetBasePath } from '../index.js';
const DefaultDefaultControllerProfileId = 'generic-trigger';
export class XRControllerLayoutLoader {
    baseAssetPath;
    defaultProfileId;
    //cache
    profilesListPromise;
    profilePromisesMap = new Map();
    constructor(options) {
        this.baseAssetPath = options?.baseAssetPath ?? DefaultAssetBasePath;
        this.defaultProfileId = options?.defaultControllerProfileId ?? DefaultDefaultControllerProfileId;
    }
    async load(inputSourceProfileIds, handedness) {
        const profile = await this.loadProfile(inputSourceProfileIds);
        for (const key in profile.layouts) {
            if (!key.includes(handedness)) {
                continue;
            }
            return profile.layouts[key];
        }
        throw new Error(`No matching layout for "${handedness}", in profile ${profile.profileId} with layouts ${Object.keys(profile.layouts).join(', ')}.`);
    }
    //alias for Loader compatibility
    loadAsync = this.load;
    async loadProfile(inputSourceProfileIds) {
        this.profilesListPromise ??= fetchJson(new URL('profilesList.json', this.baseAssetPath).href);
        const profilesList = await this.profilesListPromise;
        const length = inputSourceProfileIds.length;
        for (let i = 0; i < length; i++) {
            const profileInfo = profilesList[inputSourceProfileIds[i]];
            if (profileInfo == null) {
                continue;
            }
            return this.loadProfileFromPathCached(profileInfo.path);
        }
        const profileInfo = profilesList[this.defaultProfileId];
        if (profileInfo != null) {
            return this.loadProfileFromPathCached(profileInfo.path);
        }
        throw new Error(`no matching profile found for profiles "${inputSourceProfileIds.join(', ')}" in profile list ${JSON.stringify(profilesList)}`);
    }
    loadProfileFromPathCached(relativeProfilePath) {
        let promise = this.profilePromisesMap.get(relativeProfilePath);
        if (promise == null) {
            this.profilePromisesMap.set(relativeProfilePath, (promise = this.loadProfileFromPath(relativeProfilePath)));
        }
        return promise;
    }
    async loadProfileFromPath(relativeProfilePath) {
        const absoluteProfilePath = new URL(relativeProfilePath, this.baseAssetPath).href;
        const profile = await fetchJson(absoluteProfilePath);
        //overwrite the relative assetPath into an absolute path
        for (const key in profile.layouts) {
            const layout = profile.layouts[key];
            if (layout == null) {
                continue;
            }
            layout.assetPath = new URL(layout.assetPath, absoluteProfilePath).href;
        }
        return profile;
    }
}
async function fetchJson(url) {
    let response = await fetch(url);
    if (!response.ok) {
        return Promise.reject(new Error(response.statusText));
    }
    return response.json();
}
