import { useEffect, useState } from "react"
import "./GVPContainer.scss"
import { useAuthenticatedContext } from "../hooks/useAuthenticatedContext"
import { Shot } from "../types"

const GVPContainer = () => {
    const auth = useAuthenticatedContext()
    console.log(auth)
    const [shots, setShots] = useState([])
    const [members, setMembers] = useState([])
    const [currentShot, setCurrentShot] = useState<Shot | undefined>()
    const shotsUrl = currentShot?.thumbnailUrl.replace("https://cdn.framedsc.com", "framedsc")

    const getHof = async () => {
        const response = await fetch(`/api/hof?guildId=${auth.guildId}`)
        const resJson = await response.json()
        const { shots, members } = resJson
        setShots(shots)
        setMembers(members)
        console.log(resJson)
    }

    useEffect(() => {
        getHof()
    }, [])
    
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
        console.log(shot)
    }

    return (
        <div className="gvp__container">
            <button onClick={getHof}>
                test /hof
            </button>
            <button onClick={getRandomHofShot}>
                get random hof shot
            </button>
            {currentShot?.gameName}
            <img src={shotsUrl} alt="" />
        </div>
    )
}

export default GVPContainer