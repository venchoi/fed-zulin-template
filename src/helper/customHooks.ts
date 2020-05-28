import { DependencyList, useCallback, useEffect, useRef } from 'react';

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        } else {
            return effect();
        }
    }, deps);
};

export interface IReturnValue<T extends any[]> {
    run: (...args: T) => void;
    cancel: () => void;
}

type noop = (...args: any[]) => any;

export function useDebounceFn<T extends any[]>(fn: (...args: T) => any, wait: number): IReturnValue<T>;
export function useDebounceFn<T extends any[]>(
    fn: (...args: T) => any,
    deps: DependencyList,
    wait: number
): IReturnValue<T>;
export function useDebounceFn<T extends any[]>(
    fn: (...args: T) => any,
    deps: DependencyList | number,
    wait?: number
): IReturnValue<T> {
    const _deps: DependencyList = (Array.isArray(deps) ? deps : []) as DependencyList;
    const _wait: number = typeof deps === 'number' ? deps : wait || 0;
    const timer = useRef<any>();

    const fnRef = useRef<noop>(fn);
    fnRef.current = fn;

    const cancel = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    }, []);

    const run = useCallback(
        (...args: any) => {
            cancel();
            timer.current = setTimeout(() => {
                fnRef.current(...args);
            }, _wait);
        },
        [_wait, cancel]
    );

    useUpdateEffect(() => {
        run();
        return cancel;
    }, [..._deps, run]);

    useEffect(() => cancel, []);

    return {
        run,
        cancel,
    };
}

export function useThrottleFn<T extends any[]>(fn: (...args: T) => any, wait: number): IReturnValue<T>;
export function useThrottleFn<T extends any[]>(
    fn: (...args: T) => any,
    deps: DependencyList,
    wait: number
): IReturnValue<T>;
export function useThrottleFn<T extends any[]>(
    fn: (...args: T) => any,
    deps: DependencyList | number,
    wait?: number
): IReturnValue<T> {
    const _deps: DependencyList = (Array.isArray(deps) ? deps : []) as DependencyList;
    const _wait: number = typeof deps === 'number' ? deps : wait || 0;
    const timer = useRef<any>();

    const fnRef = useRef<noop>(fn);
    fnRef.current = fn;

    const currentArgs = useRef<any>([]);

    const cancel = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = undefined;
    }, []);

    const run = useCallback(
        (...args: any) => {
            currentArgs.current = args;
            if (!timer.current) {
                timer.current = setTimeout(() => {
                    fnRef.current(...currentArgs.current);
                    timer.current = undefined;
                }, _wait);
            }
        },
        [_wait, cancel]
    );

    useUpdateEffect(() => {
        run();
    }, [..._deps, run]);

    useEffect(() => cancel, []);

    return {
        run,
        cancel,
    };
}
