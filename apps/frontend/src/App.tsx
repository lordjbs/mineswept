import { range } from 'lodash'
import './App.css'
import styles from './App.module.css'
import Button from './components/Button'
import Grid from './components/Grid'
import JoinGame from './components/JoinGame'
import Tile from './components/Tile'
import useWebhook from './hooks/useWebsocket'
import { COLUMN_SIZE, ROW_SIZE } from './utils/tile'

function App() {
  // TODO

  const { gameId, board, createGame } = useWebhook()

  return (
    <>
      {!gameId && (
        <div className={styles.root}>
          <Button onClick={() => createGame({ type: "createGame" })}>
            Create Game
          </Button>
          <JoinGame />
        </div>
      )}
      {gameId && (
        <>
          <h1>{gameId}</h1>
          <Grid>
            {range(0,ROW_SIZE).map((_y, i) => {
              return <div>
                {range(0,COLUMN_SIZE).map((x) => {
                  const index = (i * COLUMN_SIZE) + x
                  return (
                    <Tile {...board[index]} index={index} />
                  )
                })}
              </div>
            })}
          </Grid>
        </>
      )}
    </>
  )
}

export default App
