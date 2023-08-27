import styles from './Grid.module.css'

interface GridProps {
    children?: React.ReactNode
}

const Grid = ({ children }: GridProps) => {
    return (
        <div className={styles.root}>
            <div className={styles.board}>
                {children}
            </div>
        </div>
    )
}

export default Grid