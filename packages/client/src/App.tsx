import * as React from 'react';
import {AuthenticatedContextProvider} from './hooks/useAuthenticatedContext';
import {PlayersContextProvider} from './hooks/usePlayers';
import {VoiceChannelActivity} from './components/VoiceChannelActivity';
import GVPContainer from './components/GVPContainer';
import { GameContextProvider } from './hooks/useGameContext';

export default function App() {
  return (
    <AuthenticatedContextProvider>
      <PlayersContextProvider>
        <GameContextProvider>
          <VoiceChannelActivity />
          <GVPContainer />
        </GameContextProvider>
      </PlayersContextProvider>
    </AuthenticatedContextProvider>
  );
}
