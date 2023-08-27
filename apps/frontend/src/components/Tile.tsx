import { TileState } from 'schemas'
import useWebhook from '../hooks/useWebsocket'
import styles from './Tile.module.css'
import cc from 'classcat'

interface TileProps extends TileState {
    index: number,
}

const Tile = ({ index, bomb, flagged, clicked, nearby }: TileProps) => {
    const { gameId, tileClick } = useWebhook()

    if ( !gameId )
        return null

    return (
        <button 
            type="button" 
            className={cc({
                [styles.root]: true,
                [styles.bomb]: bomb && clicked,
                [styles.flagged]: flagged,
                [styles.clicked]: clicked
            })} 
            onClick={() => tileClick(index, gameId, 'click')} 
            onContextMenu={(event) => {
                event.preventDefault()
                tileClick(index, gameId, 'flag')
            }}
            data-nearby={nearby}
        >
            &nbsp;
        </button>
    )
}

export default Tile