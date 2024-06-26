let i = 0;
const map = new Map();
export function objectToKey(object) {
    let key = map.get(object);
    if (key == null) {
        map.set(object, (key = i++));
    }
    return key;
}
