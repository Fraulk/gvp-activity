import { useEffect } from "react";

export const useOutsideAlerter = (refs: any, callback: Function) => {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (refs && !refs.some((ref: any) => ref.current && ref.current.contains(event.target))) {
                callback()
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refs]);
}