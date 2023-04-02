export const Button = ({ dataId, bomb }: { dataId: string, bomb: boolean }) => {
  const el = document.createElement("button");
  el.className = [""].join(" ");
  el.setAttribute("data-id", dataId);

  if ( bomb ) {
    el.className = [
      "bomb",
      ...el.className.split(" ")
    ].join(' ');
  }

  el.addEventListener("click", () => {
    el.className = [
      "active",
      ...el.className.split(" ")
    ].join(' ');
  });

  return el;
};

export const Row = (children: HTMLElement[], id: string) => {
    const el = document.createElement("div")
    el.id = `row-${id}`
    children.map((v) => el.appendChild(v))
    return el
}

export const generateGrid = (width: number, height: number) => {
    const size = width * height
    const field = Array(size).fill(-1);
    const bombs = Math.round((10 / size) * size);

    // Add bombs!
    const validBombLocations = [...Array(size).keys()];
    for (var i = 0; i < bombs; i++) {
      // Get a random location.
      var pos = Math.round(Math.random() * (validBombLocations.length - 0) + 0);
      // Make it a bomb.
      field[pos] = 9
      // Remove it from valid locations so we don't duplicate.
      validBombLocations.splice(pos, 1);
    }

    // Return rows!
    const rows = Array(height).fill('-1').map((_v, rowIndex) => {
      return Row(
        Array(width).fill('-1').map((_v, columnIndex) => {
          const dataId = rowIndex * width + columnIndex;
          return Button({
            dataId: `${dataId}`,
            bomb: field[dataId] === 9
          });
        }),
        `${i}`
      )
    })

    const grid = document.createElement('div')
    grid.className = "grid"
    rows.map((v) => grid.appendChild(v));

    return grid
}