import { range } from "lodash";
import { ms } from './main';

const generateBoard = (COLUMN_SIZE: number, ROW_SIZE: number) => {
  const board = range(0, 64).map(() => ({
    clicked: false,
    bomb: false,
    flagged: false,
    nearby: 0,
  }));

  const width = COLUMN_SIZE;
  const size = COLUMN_SIZE * ROW_SIZE;
  const bombs = Math.round((10 / size) * size);

  const validBombLocations = [...Array(size).keys()];
  for (let i = 0; i < bombs; i++) {
    // Get a random location.
    const pos = Math.round(Math.random() * (validBombLocations.length - 0) + 0);
    // Make it a bomb.
    board[pos] = {
      ...board[pos],
      bomb: true,
    };
    // Remove it from valid locations so we don't duplicate.
    validBombLocations.splice(pos, 1);
  }

  for (let n = 0; n < size; n++) {
    const fVal = board[n];
    if (fVal.bomb === true) continue; // Ignore if bomb
    let finalNumber = 0;

    const numbers = [
      -1,
      1,
      -(width - 1),
      -width,
      -(width + 1),
      width - 1,
      width,
      width + 1,
    ];

    for (const x in numbers) {
      const num = numbers[x];
      const i = n + num;

      if (i < 0 || i > size) continue; // Exit if irrelevant
      if (
        (n + 1) % width == 0 &&
        (num == 1 || num == width + 1 || num == -(width - 1))
      )
        continue;
      if (
        n % width == 0 &&
        (num == -1 || num == -(width + 1) || num == width - 1)
      )
        continue;
      if (board[i] === undefined) continue;
      if (board[i].bomb === true) finalNumber++;
    }

    board[n] = {
      ...board[n],
      nearby: finalNumber,
    };
  }

  return board;
};

const revealFields = (gameId: number, fieldNum: number, _checked: number[] | undefined) => {
  const board = ms.games[gameId].board;

  if (board[fieldNum].bomb || board[fieldNum].flagged) return;

  const nearby: { [key: number]: boolean } = {}; // Weird hack TODO: FIX THIS!!

  let checked: number[] = (_checked === undefined) ? [] : _checked;

  if (fieldNum > 8) {
    if (fieldNum % 8 != 7) nearby[(fieldNum - 7)] = true;
    nearby[(fieldNum - 8)] = true;
    if (fieldNum % 8 != 0) nearby[(fieldNum - 9)] = true;
  }
  if (fieldNum < ((8 * 8) - 8)) {
    if (fieldNum % 8 != 0) nearby[fieldNum + 7] = true;
    nearby[fieldNum + 8] = true;
    if (fieldNum % 8 != 7) nearby[fieldNum + 9] = true;
  }
  if (fieldNum % 8 != 1 && fieldNum % 8 != 0) nearby[fieldNum - 1] = true;
  if (fieldNum % 8 != 0 && fieldNum % 8 != 7) nearby[fieldNum + 1] = true;

  for (const [_num, _] of Object.entries(nearby)) {
    let num = parseInt(_num);
    if (checked.includes(num)) return;
    if (!board[num].clicked && !board[num].bomb) {
      if (board[fieldNum].nearby > 0) {
        if (board[num].nearby > 0) {
          delete nearby[num];
        }
      } else {
        board[num].clicked = true;
      }
      if (board[num].nearby > 0) {
        delete nearby[num];
      }
    } else {
      delete nearby[num];
    }

  }

  for (const [num, _] of Object.entries(nearby)) {
    revealFields(gameId, parseInt(num), checked);
  }
};

export { generateBoard, revealFields };
