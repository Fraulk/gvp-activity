import { useEffect, useMemo, useRef, useState } from "react"
import "./GVPContainer.scss"
import { useAuthenticatedContext } from "../hooks/useAuthenticatedContext"
import { Shot } from "../types"
import { useGame } from "../hooks/useGameContext"
import { useOutsideAlerter } from "../hooks/useOutsideAlerter"
import { useKeyPress } from "../hooks/useKeyPress"
import { usePlayers } from "../hooks/usePlayers"

interface Member {
    displayAvatarURL: string
    displayName: string
    nickname: string
    userId: string
}

const randomNames = ["Patrick", "Bob", "Alice", "John", "Doe", "Jane", "Putsos", "Putsovager", "Guy who takes screenshots", "Screen-Archer"]
const randomNameFunc = randomNames[Math.floor(Math.random() * randomNames.length)] || "Name"

const GVPContainer = () => {
    const { guildMember, guildId, room } = useAuthenticatedContext()
    const currentMemberId = guildMember?.user?.id
    const { shot: synchronizedShot, author: synchronizedAuthor, guesses } = useGame()
    const players = usePlayers()
    const currentPlayer = players.find((player) => player.userId === currentMemberId)
    const [shots, setShots] = useState([])
    const [members, setMembers] = useState<Member[]>([])
    const [currentShot, setCurrentShot] = useState<Shot | undefined>()
    const [currentShotAuthor, setCurrentShotAuthor] = useState<Member>()
    const [userGuess, setUserGuess] = useState("")
    const [placeholder, setPlaceholder] = useState(randomNameFunc)
    const [showAutocomplete, setShowAutocomplete] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState(-1)

    const autocompleteRef = useRef<HTMLDivElement>(null)
    const guessesListRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const guessesAutocomplete: Member[] = useMemo(
        () =>
            userGuess.length > 0 && showAutocomplete
                ? members.filter((member) => member.displayName?.includes(userGuess) || member.nickname?.includes(userGuess))
                : [],
        [userGuess, showAutocomplete]
    )

    const shotsUrl = currentShot?.thumbnailUrl.replace("https://cdn.framedsc.com", "framedsc")
    // ItsYFP: 158655628531859456, Denis_VP (can't remember why): 411108650720034817
    const blacklist = ["411108650720034817"]
    const isBlacklisted = currentShot && blacklist.includes(currentShot?.author)

    const getHof = async () => {
        const response = await fetch(`/api/hof?guildId=${guildId}`)
        const resJson = await response.json()
        const { shots, members } = resJson
        setShots(shots)
        setMembers(members)
    }

    const normalizeSynchronizedElement = (shot: any): any => {
        return shot.reduce(
            (acc: any, shot: any) => ({
                ...acc,
                [shot.field]: shot.value,
            }),
            {}
        )
    }

    const handleUserGuess = (value: string) => {
        if (value.length > 0) setShowAutocomplete(true)
        else setShowAutocomplete(false)
        setUserGuess(value)
        setFocusedIndex(-1)
    }

    const handleAutocompleteClick = (member: Member) => {
        setUserGuess(member.displayName)
        setShowAutocomplete(false)
    }

    const goUpward = () => setFocusedIndex((prev) => (prev > 0 ? prev - 1 : guessesAutocomplete.length - 1))
    const goDownward = () => setFocusedIndex((prev) => (prev < guessesAutocomplete.length - 1 ? prev + 1 : 0))

    useKeyPress(["Escape"], "", () => setShowAutocomplete(false))

    useKeyPress(["ArrowUp"], "", () => goUpward())
    useKeyPress(["Tab"], "shiftKey", () => goUpward())

    useKeyPress(["ArrowDown"], "", () => goDownward())
    useKeyPress(["Tab"], "", () => goDownward())

    useKeyPress(["Enter"], "", () => {
        if (!showAutocomplete) return
        handleUserGuess(guessesAutocomplete[focusedIndex]?.displayName ?? "")
        setShowAutocomplete(false)
        setFocusedIndex(-1)
    })

    useOutsideAlerter([autocompleteRef], () => setShowAutocomplete(false))

    useEffect(() => {
        getHof()
    }, [])

    useEffect(() => {
        if (synchronizedShot) setCurrentShot(normalizeSynchronizedElement(synchronizedShot))
    }, [synchronizedShot])

    useEffect(() => {
        if (synchronizedAuthor) setCurrentShotAuthor(normalizeSynchronizedElement(synchronizedAuthor))
    }, [synchronizedAuthor])

    useEffect(() => {
        if (guessesListRef.current && guessesListRef.current.scrollTop + guessesListRef.current.clientHeight + 48 >= guessesListRef.current.scrollHeight)
            guessesListRef.current?.scrollTo(0, guessesListRef.current?.scrollHeight)
    }, [guesses])

    const getRandomHofShot = () => {
        // lastShots = []
        // blacklist = ["158655628531859456", "411108650720034817"]
        // bufferSize = 20
        // async def getHofShot(ctx):
        //     response = requests.get("https://raw.githubusercontent.com/originalnicodrgitbot/hall-of-framed-db/main/shotsdb.json", allow_redirects=True)
        //     assert response.status_code == 200, 'Wrong status code'
        //     resJson = json.loads(response.content)
        //     # print(resJson["_default"][str(random.randint(1, len(resJson["_default"])))])
        //     while True:
        //         print("loop")
        //         try:
        //             shot = resJson["_default"][str(random.randint(1, len(resJson["_default"])))]
        //         except:
        //             continue
        //         author = shot['author']
        //         if author in blacklist or author in lastShots:
        //             print(f"author ({author}) either is blacklisted or was already shown in the last {bufferSize} games")
        //             continue
        //         member = discord.utils.find(lambda m: m.id == int(author) or m.id == int(author), ctx.guild.members)
        //         if member != None:
        //             break
        //     lastShots.insert(0, author)
        //     if len(lastShots) > bufferSize:
        //         lastShots.pop()
        //     return shot
        let shot: any
        let member: any
        while (true) {
            shot = shots[Math.floor(Math.random() * shots.length)]
            if (blacklist.includes(shot.author)) continue
            member = members.find((member) => member.userId == shot.author)
            if (member) break
        }
        setCurrentShotAuthor(member)
        setCurrentShot(shot)
        room.send("setCurrentGame", shot)
        room.send("setCurrentAuthor", member)
        setPlaceholder(randomNameFunc)
    }

    const handleGuess = () => {
        if (currentShot && userGuess.length > 0) {
            room.send("newGuess", { player: currentPlayer, message: userGuess })
            setUserGuess("")
            inputRef.current?.focus()
            if (userGuess === currentShotAuthor?.displayName || userGuess === currentShotAuthor?.nickname) {
                room.send("newGuess", { player: currentPlayer, message: "TESTSETSETSE", hasWon: true, author: currentShotAuthor?.displayName})
                getRandomHofShot()
            }
        }
    }

    return (
        <div className="gvp__container">
            <button onClick={getRandomHofShot}>get random hof shot</button>
            <div className="gvp__body" style={{ "--shot-color": currentShot?.colorName } as any}>
                <div className="gvp__image" style={{ "--shot-url": `url('${currentShot?.thumbnailUrl}')` } as any}>
                    <div className="gvp__blurred-image">
                        <img
                            src={shotsUrl}
                            alt=""
                            onDragStart={(e) => {
                                e.preventDefault()
                            }}
                        />
                    </div>
                    <img
                        src={shotsUrl}
                        alt=""
                        className={isBlacklisted ? "gvp__image--blacklisted" : ""}
                        onDragStart={(e) => e.preventDefault()}
                    />
                </div>
                <div className="gvp__guesses">
                    <div className="gvp__guesses__list" ref={guessesListRef}>
                        {guesses &&
                            guesses.map((guess, i) => {
                                const isSameUserBefore = i > 0 && guesses[i - 1].player.userId === guess.player.userId

                                return guess.hasWon ? (
                                    <div className="gvp__guesses__item__winner">
                                        {guess.player.name} found who's that VP! It was {guess.author}!
                                    </div>
                                ) : (
                                    <div key={i} className={`gvp__guesses__item ${isSameUserBefore ? "message__only" : ""}`}>
                                        {isSameUserBefore ? (
                                            <div className="gvp__guesses__item__only__message">{guess.message}</div>
                                        ) : (
                                            <>
                                                <img src={guess.player.avatarUri} alt="" onDragStart={(e) => e.preventDefault()} />
                                                <div>
                                                    <div className="gvp__guesses__item__name">{guess.player.name}</div>
                                                    <div className="gvp__guesses__item__message">{guess.message}</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )
                            })}
                    </div>
                    <div className="gvp__guesses__separator"></div>
                    <div className="gvp__guesses__input">
                        {guessesAutocomplete.length > 0 && (
                            <div className="gvp__guesses__autocomplete" ref={autocompleteRef}>
                                {guessesAutocomplete.map((member, i) => (
                                    <div
                                        key={member.displayName}
                                        className={`gvp__guesses__autocomplete__item ${focusedIndex == i ? " hasFocus" : ""}`}
                                        onClick={() => handleAutocompleteClick(member)}
                                    >
                                        <img src={member.displayAvatarURL} alt="" />
                                        <span>{member.displayName}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <input
                            type="text"
                            ref={inputRef}
                            placeholder={placeholder}
                            value={userGuess}
                            onChange={(e) => handleUserGuess(e.target.value)}
                            onKeyDown={(e) => e.key == "Enter" && (!showAutocomplete || guessesAutocomplete.length == 0) && handleGuess()}
                        />
                        <div className={`gvp__guesses__sendIcon ${userGuess?.length > 0 ? "active" : ""}`} onClick={handleGuess}>
                            <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M6.6 10.02 14 11.4a.6.6 0 0 1 0 1.18L6.6 14l-2.94 5.87a1.48 1.48 0 0 0 1.99 1.98l17.03-8.52a1.48 1.48 0 0 0 0-2.64L5.65 2.16a1.48 1.48 0 0 0-1.99 1.98l2.94 5.88Z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GVPContainer
