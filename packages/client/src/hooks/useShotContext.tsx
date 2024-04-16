import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Shot as ShotState } from '../../../server/src/entities/Shot';
import { useAuthenticatedContext } from './useAuthenticatedContext';

const ShotContext = createContext<ShotState | undefined>(undefined);

export function ShotContextProvider({ children }: { children: ReactNode }) {
    const shot = useShotContextSetup();

    return <ShotContext.Provider value={shot}>{children}</ShotContext.Provider>;
}

export function useShot() {
    return useContext(ShotContext);
}

function useShotContextSetup() {
    const [shot, setShot] = useState<ShotState | undefined>();

    const authenticatedContext = useAuthenticatedContext();

    useEffect(() => {
        try {
            if (authenticatedContext.room.state.shot) {
                authenticatedContext.room.state.shot.onChange = (_shot: any) => {
                    setShot(_shot)
                }
            }
        } catch (e) {
            console.error("Couldn't change shot:", e);
        }
    }, [authenticatedContext.room.state.shot]);

    return shot;
}
