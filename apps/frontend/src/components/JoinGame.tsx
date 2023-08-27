import { useState } from "react"
import useWebhook from "../hooks/useWebsocket"

const JoinGame = () => {
    const [pinCode, setPinCode] = useState("")
    const { joinGame } = useWebhook()

    return (
        <div>
            <input type="text" onChange={(event) => setPinCode(event.target.value)} value={pinCode}></input>
            <button type="button" onClick={() => joinGame(pinCode)}>
                join game
            </button>
        </div>
    )
}

export default JoinGame