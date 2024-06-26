export function hasObjectListeners({ _listeners, __r3f }) {
    if (_listeners != null && Object.keys(_listeners).length > 0) {
        return true;
    }
    if (__r3f != null && __r3f?.eventCount > 0) {
        return true;
    }
    return false;
}
export function getObjectListeners({ _listeners, __r3f }, forEvent) {
    if (_listeners != null && forEvent in _listeners) {
        return _listeners[forEvent];
    }
    //R3F compatibility
    if (__r3f == null) {
        return undefined;
    }
    const handler = __r3f.handlers[r3fEventToHandlerMap[forEvent]];
    if (handler == null) {
        return;
    }
    return [handler];
}
const r3fEventToHandlerMap = {
    click: 'onClick',
    contextmenu: 'onContextMenu',
    dblclick: 'onDoubleClick',
    pointercancel: 'onPointerCancel',
    pointerdown: 'onPointerDown',
    pointerenter: 'onPointerEnter',
    pointerleave: 'onPointerLeave',
    pointermove: 'onPointerMove',
    pointerout: 'onPointerOut',
    pointerover: 'onPointerOver',
    pointerup: 'onPointerUp',
    wheel: 'onWheel',
};
