import './App.css'
import styles from './App.module.css'
import Tile from './components/Tile'
import Grid from './components/Grid'
import { range } from 'lodash'
import useWebhook from './hooks/useWebsocket'
import { ROW_SIZE, COLUMN_SIZE } from './utils/tile'
import JoinGame from './components/JoinGame'
import Button from './components/Button'

function App() {
  // TODO

  const { gameId, board, createGame } = useWebhook()

  return (
    <>
      {!gameId && (
        <div className={styles.root}>
          <Button onClick={() => createGame()}>
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
