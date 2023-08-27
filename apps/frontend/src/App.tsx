import './App.css'
import Tile from './components/Tile'
import Grid from './components/Grid'
import { range } from 'lodash'

function App() {
  // TODO
  const COLUMN_SIZE = 10
  const ROW_SIZE = 10

  return (
    <>
      <Grid>
        {range(0,ROW_SIZE).map(() => {
          return <div>
            {range(0,COLUMN_SIZE).map(() => {
              return <Tile bomb={false} flagged={false} clicked={false} />
            })}
          </div>
        })}
      </Grid>
    </>
  )
}

export default App
