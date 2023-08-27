import useWebhook from '../hooks/useWebsocket'
import styles from './Tile.module.css'
import cc from 'classcat'

interface TileProps {
    bomb: boolean,
    flagged: boolean,
    clicked: boolean,
}

const Tile = ({ bomb, flagged, clicked }: TileProps) => {
    const { send } = useWebhook()

    return (
        <button 
            type="button" 
            className={cc({
                [styles.root]: true,
                [styles.bomb]: bomb,
                [styles.flagged]: flagged && bomb !== true,
                [styles.clicked]: clicked && bomb !== true,
            })} 
            onClick={() => send()} 
            // onContextMenu={() => setter({
            //     bomb,
            //     clicked,
            //     flagged: true,
            // })}
        >
            &nbsp;
        </button>
    )
}

export default Tile