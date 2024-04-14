import { useEffect } from "react"
import "./GVPContainer.scss"
import { useAuthenticatedContext } from "../hooks/useAuthenticatedContext"

const GVPContainer = () => {
    const auth = useAuthenticatedContext()
    console.log(auth)

    useEffect(() => {
        const getHof = async () => {
            const response = await fetch(`/api/hof?guildId=${auth.guildId}`)
            const resJson = await response.json()
            console.log(resJson)
        }
        getHof()
    }, [])

    const getHof = async () => {
        const response = await fetch(`/api/hof?guildId=${auth.guildId}`)
        const resJson = await response.json()
        console.log(resJson)
    }
    
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

    }

    return (
        <div className="gvp__container">
            <button onClick={getHof}>
                test /hof
            </button>
        </div>
    )
}

export default GVPContainer