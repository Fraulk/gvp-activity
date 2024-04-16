import * as React from 'react';
import {AuthenticatedContextProvider} from './hooks/useAuthenticatedContext';
import {PlayersContextProvider} from './hooks/usePlayers';
import {VoiceChannelActivity} from './components/VoiceChannelActivity';
import GVPContainer from './components/GVPContainer';
import { ShotContextProvider } from './hooks/useShotContext';

export default function App() {
  return (
    <AuthenticatedContextProvider>
      <PlayersContextProvider>
        <ShotContextProvider>
          <VoiceChannelActivity />
          <GVPContainer />
        </ShotContextProvider>
      </PlayersContextProvider>
    </AuthenticatedContextProvider>
  );
}
