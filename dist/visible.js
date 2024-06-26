export function setupSyncIsVisible(store, setIsVisible) {
    const update = (state, prevState) => {
        if (prevState != null && state.visibilityState === prevState.visibilityState) {
            return;
        }
        setIsVisible(state.visibilityState === 'visible');
    };
    update(store.getState());
    return store.subscribe(update);
}
