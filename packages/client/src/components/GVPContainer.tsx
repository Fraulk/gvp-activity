import { useEffect, useState } from "react"
import "./GVPContainer.scss"
import { useAuthenticatedContext } from "../hooks/useAuthenticatedContext"
import { Shot } from "../types"
import { useShot } from "../hooks/useShotContext"

const GVPContainer = () => {
    const { guildId, room } = useAuthenticatedContext()
    const synchronizedShot = useShot()
    const [shots, setShots] = useState([])
    const [members, setMembers] = useState([])
    const [currentShot, setCurrentShot] = useState<Shot | undefined>()
    const shotsUrl = currentShot?.thumbnailUrl.replace("https://cdn.framedsc.com", "framedsc")
    const blacklist = ["158655628531859456", "411108650720034817"]
    const isBlacklisted = currentShot && blacklist.includes(currentShot?.author)

    const getHof = async () => {
        const response = await fetch(`/api/hof?guildId=${guildId}`)
        const resJson = await response.json()
        const { shots, members } = resJson
        setShots(shots)
        setMembers(members)
    }

    const normalizeSynchronizedShot = (shot: any): Shot => {
        return shot.reduce(
            (acc: any, shot: any) => ({
                ...acc,
                [shot.field]: shot.value,
            }),
            {}
        ) as Shot
    }

    useEffect(() => {
        getHof()
    }, [])

    useEffect(() => {
        if (synchronizedShot) setCurrentShot(normalizeSynchronizedShot(synchronizedShot))
    }, [synchronizedShot])

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
        const shot = shots[Math.floor(Math.random() * shots.length)]
        setCurrentShot(shot)
        room.send("setCurrentGame", shot)
    }

    return (
        <div className="gvp__container">
            <button onClick={getRandomHofShot}>get random hof shot</button>
            <div className="gvp__body" style={{"--shot-color": currentShot?.colorName} as any}>
                <div className="gvp__image" style={{"--shot-url": `url('${currentShot?.thumbnailUrl}')`} as any}>
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
                        onDragStart={(e) => {
                            e.preventDefault()
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default GVPContainer
