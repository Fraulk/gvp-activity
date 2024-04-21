import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { Shot as ShotState } from "../../../server/src/entities/Shot"
import { useAuthenticatedContext } from "./useAuthenticatedContext"
import { IGuess } from "../../../server/src/entities/Guess"

const GameContext = createContext<{ shot: ShotState | undefined; guesses: IGuess[] }>({ shot: undefined, guesses: [] })

export function GameContextProvider({ children }: { children: ReactNode }) {
    const game = useGameContextSetup()

    return <GameContext.Provider value={game}>{children}</GameContext.Provider>
}

export function useGame() {
    return useContext(GameContext)
}

function useGameContextSetup() {
    const [shot, setShot] = useState<ShotState | undefined>()
    const [guesses, setGuesses] = useState<IGuess[]>([])

    const authenticatedContext = useAuthenticatedContext()

    useEffect(() => {
        try {
            if (authenticatedContext.room.state.shot) {
                authenticatedContext.room.state.shot.onChange = (_shot: any) => {
                    setShot(_shot)
                }
            }
            if (authenticatedContext.room.state.guesses) {
                // authenticatedContext.room.state.guesses.onChange = (_guesses: any) => {
                //     console.log(_guesses)
                //     setGuesses(_guesses)
                // }
                authenticatedContext.room.state.guesses.onAdd = function (guesse, _key) {
                    setGuesses((guesses) => [...guesses, guesse])
                    // player.onChange = function (changes) {
                    //     setPlayers((players) =>
                    //         players.map((p) => {
                    //             if (p.userId !== player.userId) {
                    //                 return p
                    //             }
                    //             changes.forEach(({ field, value }) => {
                    //                 // @ts-expect-error
                    //                 p[field] = value
                    //             })
                    //             return p
                    //         })
                    //     )
                    // }
                }
            }
        } catch (e) {
            console.error("Couldn't change shot:", e)
        }
    }, [authenticatedContext.room.state.shot, authenticatedContext.room.state.guesses])

    return { shot, guesses }
}
