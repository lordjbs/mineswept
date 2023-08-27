import styles from './Tile.module.css'
import cc from 'classcat'

interface TileProps {
    bomb: boolean,
    flagged: boolean,
    clicked: boolean,
    setter(state: {
        bomb: boolean,
        flagged: boolean,
        clicked: boolean,
    }): void,
}

const Tile = ({ bomb, flagged, clicked, setter }: TileProps) => {
    return (
        <button type="button" className={cc({
            [styles.root]: true,
            [styles.bomb]: bomb,
            [styles.flagged]: flagged && bomb !== true,
            [styles.clicked]: clicked && bomb !== true,
        })} onClick={() => setter({
            bomb,
            flagged,
            clicked: true
        })} onContextMenu={() => setter({
            bomb,
            clicked,
            flagged: true,
        })}>
            &nbsp;
        </button>
    )
}

export default Tile