import { useState } from "react"
import useWebhook from "../hooks/useWebsocket"
import Button from "./Button"
import Input from "./Input"
import styles from './JoinGame.module.css'

const JoinGame = () => {
    const [pinCode, setPinCode] = useState("")
    const { joinGame } = useWebhook()

    return (
        <div className={styles.root}>
            <Input type="text" onChange={(event) => setPinCode(event.target.value)} value={pinCode} />
            <Button type="button" onClick={() => joinGame(pinCode)}>
                Join game
            </Button>
        </div>
    )
}

export default JoinGame