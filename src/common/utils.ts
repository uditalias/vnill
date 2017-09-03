const hasOwn = Object.prototype.hasOwnProperty;

export const cloneDeep = (obj: any = {}) => JSON.parse(JSON.stringify(obj));

export const shallowEqual = (a: any, b: any) => {
    if (a === b) {
        return true;
    }

    let countA = 0;
    let countB = 0;

    for (const key in a) {
        if (hasOwn.call(a, key) && a[key] !== b[key]) {
            return false;
        }

        countA++;
    }

    for (const key in b) {
        if (hasOwn.call(b, key)) {
            countB++;
        }
    }

    return countA === countB;
};

export const trimEndSlash = (str: string): string => {
    if (str.lastIndexOf('/') == str.length - 1) {
        return str.substr(0, str.length - 1);
    }

    return str;
};