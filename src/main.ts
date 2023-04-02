import './style.css'

const Button = ({
  dataId,
  bomb,
  surrounds,
}: {
  dataId: string;
  bomb: boolean;
  surrounds: number;
}) => {
  const el = document.createElement("button");
  el.className = [""].join(" ");
  el.setAttribute("data-id", dataId);
  el.setAttribute("data-surround", `${surrounds}`);

  if (bomb) {
    el.className = ["bomb", ...el.className.split(" ")].join(" ");
  }

  el.addEventListener("click", () => {
    if (el.classList.contains("active")) return;
    el.className = ["active", ...el.className.split(" ")].join(" ");

    if (bomb) {
      var loseSound = new Audio("/audio/lose.wav");
      loseSound.play();
      document.querySelectorAll(".bomb").forEach((el) => {
        el.className = ["active", ...el.className.split(" ")].join(" ");
      });
    } else {
      var tickSound = new Audio("/audio/tick.wav");
      tickSound.play();
    }
  });

  return el;
};

const Row = (children: HTMLElement[], id: string) => {
  const el = document.createElement("div");
  el.id = `row-${id}`;
  children.map((v) => el.appendChild(v));
  return el;
};

const generateGrid = (width: number, height: number) => {
  const size = width * height;
  const field = Array(size).fill(-1);
  const bombs = Math.round((10 / size) * size);

  // Add bombs!
  const validBombLocations = [...Array(size).keys()];
  for (var i = 0; i < bombs; i++) {
    // Get a random location.
    var pos = Math.round(Math.random() * (validBombLocations.length - 0) + 0);
    // Make it a bomb.
    field[pos] = 9;
    // Remove it from valid locations so we don't duplicate.
    validBombLocations.splice(pos, 1);
  }

  // Add numbers!
  for (var n = 0; n < size; n++) {
    let fVal = field[n];
    if (fVal == 9) continue; // Ignore if bomb
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
      if (field[i] == 9) finalNumber++;
    }

    field[n] = finalNumber;
  }

  // Return rows!
  const rows = Array(height)
    .fill("-1")
    .map((_v, rowIndex) => {
      return Row(
        Array(width)
          .fill("-1")
          .map((_v, columnIndex) => {
            const dataId = rowIndex * width + columnIndex;
            return Button({
              dataId: `${dataId}`,
              bomb: field[dataId] === 9,
              surrounds: field[dataId],
            });
          }),
        `${rowIndex}`
      );
    });

  const grid = document.createElement("div");
  grid.className = "grid";
  rows.map((v) => grid.appendChild(v));

  return grid;
};

const app = document.querySelector("#app");

const header = document.createElement('header');

const bombs = document.createElement('div')
bombs.textContent = "0";

const status = document.createElement("button");
status.setAttribute('type', 'button')

const statusImage = document.createElement("img");
statusImage.setAttribute('src', '/faces/smile.svg')
status.appendChild(statusImage);

const timer = document.createElement("div");
timer.textContent = "0";

header.appendChild(bombs)
header.appendChild(status)
header.appendChild(timer)

const board = document.createElement('section')
board.className = "board"
board.appendChild(generateGrid(12, 12))

if ( app ) {
  app.appendChild(header);
  app.appendChild(board);
}