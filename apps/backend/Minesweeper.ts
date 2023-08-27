import { range } from "lodash";

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
  for (var i = 0; i < bombs; i++) {
    // Get a random location.
    var pos = Math.round(Math.random() * (validBombLocations.length - 0) + 0);
    // Make it a bomb.
    board[pos] = {
      ...board[pos],
      bomb: true,
    };
    // Remove it from valid locations so we don't duplicate.
    validBombLocations.splice(pos, 1);
  }

  for (var n = 0; n < size; n++) {
    let fVal = board[n];
    if (fVal.bomb === true) continue; // Ignore if bomb
    var finalNumber = 0;

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
      let num = numbers[x];
      let i = n + num;

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

export { generateBoard };
