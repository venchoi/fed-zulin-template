import React, { useState } from 'react';
interface useMap<T> {
    [index: string]: T 
}

export const useBatchState = (defaultValue: useMap) => {
    const keys = Object.keys(defaultValue);
    let useMap = {}
    keys.forEach(key => {
        useMap[key] = useState(defaultValue[key])
    })
}

export default useBatchState;