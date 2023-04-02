import './style.css'

/* multiplayer logic */
const cursor = document.getElementById('cursor') as HTMLImageElement;
const input = document.getElementById("idInput") as HTMLInputElement;

const ws = new WebSocket("ws://localhost:3000/");
var mouseEnabled = false;

ws.addEventListener('open', () => {
  console.log("Connected to game server");
});

ws.addEventListener('message', (event: MessageEvent) => {
  const msg = JSON.parse(event.data);

  switch(msg.type) {
    case "createGame": 
      let field: Array<any> = generateField(9, 9);
      ws.send(JSON.stringify({type: "gameField", field}));
      board.appendChild(generateGrid(9, 9, field));
      input.value = msg.id;

      if(!mouseEnabled) app?.addEventListener("mousemove", (event: MouseEvent) => {mouseEnabled = true; ws.send(JSON.stringify({type: "mouseMove", x: event.x, y: event.y}));});

      break;
    case "joinGame":
      if(!msg.success) return input.value = "Error";
      board.appendChild(generateGrid(9, 9, msg.field));
      
      if(!mouseEnabled) app?.addEventListener("mousemove", (event: MouseEvent) => {mouseEnabled = true; ws.send(JSON.stringify({type: "mouseMove", x: event.x, y: event.y}));});
      break;
    case "fieldClick":
      let el = document.getElementById(msg.num)!!;

      if (el.className == "bomb ") {
        var loseSound = new Audio("/audio/lose.wav");
        loseSound.play();
        document.querySelectorAll(".bomb").forEach((el) => {
          el.className = ["active", ...el.className.split(" ")].join(" ");
        });
      } else {
        var tickSound = new Audio("/audio/tick.wav");
        tickSound.play();
      }

      el.className = ["active", ...document.getElementById(msg.num)!!.className.split(" ")].join(" ");
      break;
    case "mouseMove":
      cursor.style.left = `${msg.x}px`;
      cursor.style.top = `${msg.y}px`;
      cursor.style.position = `absolute`;
      break;
  }
});

document.getElementById("createButton")?.addEventListener("click", () => {
  ws.send(JSON.stringify({type: "createGame"}));
});

document.getElementById("joinButton")?.addEventListener("click", () => {
  ws.send(JSON.stringify({type: "joinGame", id: input.value}))
});

const Digit = ({}) => {
  const el = document.createElement("div");
  el.className = "digit"

  const string = "123";

  string.split("").map((v) => {string.split('')
    const el2 = document.createElement("img");
    el2.setAttribute('src', `/digit/${v}.svg`)
    el.appendChild(el2);
  });

  return el
}

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
  el.id = dataId;
  el.setAttribute("data-surround", `${surrounds}`);

  if (bomb) {
    el.className = ["bomb", ...el.className.split(" ")].join(" ");
  }

  el.addEventListener("click", () => {
    if (el.classList.contains("active")) return;
    el.className = ["active", ...el.className.split(" ")].join(" ");

    ws.send(JSON.stringify({type: "fieldClick", num: el.attributes.getNamedItem("data-id")?.value}))

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

const generateField = (width: number, height: number) => {
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

  return field;
};

const generateGrid = (width: number, height: number, field: Array<any>) => {
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
}

const app = document.querySelector("#app");

const header = document.createElement('header');

const bombs = Digit({});

const status = document.createElement("button");
status.setAttribute('type', 'button')

const statusImage = document.createElement("img");
statusImage.setAttribute('src', '/faces/smile.svg')
status.appendChild(statusImage);

const timer = Digit({});

header.appendChild(bombs)
header.appendChild(status)
header.appendChild(timer)

const board = document.createElement('section')
board.className = "board"

if ( app ) {
  app.appendChild(header);
  app.appendChild(board);
}