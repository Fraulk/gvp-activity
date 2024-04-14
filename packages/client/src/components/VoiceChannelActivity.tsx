import { Player } from "./Player";
import { usePlayers } from "../hooks/usePlayers";
import "./VoiceChannelActivity.css";
import { useEffect } from "react";

export function VoiceChannelActivity() {
  const players = usePlayers();

//   simulates lots of players
//   useEffect(() => {
//     players.push(...players);
//     players.push(...players);
//     players.push(...players);
//   }, []);

  return (
    <div className="voice__channel__container">
      {players.map((p) => (
        <Player key={p.userId} {...p} />
      ))}
    </div>
  );
}
