import { useRef, useLayoutEffect, useCallback, useEffect } from "react";

export const useKeyPress = (keys: any, specialKey: string, callback: any, node = null) => {
    // implement the callback ref pattern
    const callbackRef = useRef(callback);
    useLayoutEffect(() => {
        callbackRef.current = callback;
    });

    // handle what happens on key press
    const handleKeyPress = useCallback(
        (event: any) => {
            // event.preventDefault()
            // check if one of the key is part of the ones we want
            if (keys.some((key: any) => event.key === key) && (specialKey && event[specialKey] === true || specialKey == "")) {
                event.preventDefault()
                callbackRef.current(event);
            }
        },
        [keys]
    );

    useEffect(() => {
        // target is either the provided node or the document
        const targetNode = node ?? document;
        // attach the event listener
        targetNode &&
            targetNode.addEventListener("keydown", handleKeyPress);

        // remove the event listener
        return () =>
            targetNode && targetNode.removeEventListener("keydown", handleKeyPress);
    }, [handleKeyPress, node]);
};