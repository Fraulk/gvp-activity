import * as React from 'react';
import {AuthenticatedContextProvider} from './hooks/useAuthenticatedContext';
import {PlayersContextProvider} from './hooks/usePlayers';
import {VoiceChannelActivity} from './components/VoiceChannelActivity';
import GVPContainer from './components/GVPContainer';

export default function App() {
  return (
    <AuthenticatedContextProvider>
      <PlayersContextProvider>
        <VoiceChannelActivity />
        <GVPContainer />
      </PlayersContextProvider>
    </AuthenticatedContextProvider>
  );
}
