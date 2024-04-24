import { useCallback, useEffect, useState } from "react";
import { discordSdk } from "../discordSdk";
import { Events } from "@discord/embedded-app-sdk";

export const useIsPiP = () => {
    const [isPiP, setIsPiP] = useState(false)

    const handleLayoutModeUpdate = useCallback((update: { layout_mode: number }) => {
        setIsPiP(!!update.layout_mode)
    }, []);

    useEffect(() => {
        discordSdk.subscribe(Events.ACTIVITY_LAYOUT_MODE_UPDATE, handleLayoutModeUpdate);
        // doesn't work when unsubscribing
        // return () => {
        //     discordSdk.unsubscribe(Events.ACTIVITY_LAYOUT_MODE_UPDATE, handleLayoutModeUpdate);
        // };
    }, [handleLayoutModeUpdate]);

    return isPiP;
}