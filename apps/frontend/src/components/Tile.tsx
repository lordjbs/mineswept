import useWebhook from '../hooks/useWebsocket'
import styles from './Tile.module.css'
import cc from 'classcat'

interface TileProps {
    index: number,
    clicked: boolean,
    // bomb: boolean,
    // flagged: boolean,
}

const Tile = ({ index, clicked }: TileProps) => {
    const { tileClick } = useWebhook()

    return (
        <button 
            type="button" 
            className={cc({
                [styles.root]: true,
                // [styles.bomb]: bomb,
                // [styles.flagged]: flagged && bomb !== true,
                [styles.clicked]: clicked
            })} 
            onClick={() => tileClick(index)} 
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