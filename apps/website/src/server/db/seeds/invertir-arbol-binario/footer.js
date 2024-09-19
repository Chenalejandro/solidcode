
function treeToArray(root) {
  if (root === null) {
    return [];
  }

  const treeAsArray = [];
  const queue = [root];

  while (queue.length !== 0) {
    const currentNode = queue.shift();

    if (currentNode === null) {
      treeAsArray.push(-1);
      continue;
    }
    treeAsArray.push(currentNode.valor);
    queue.push(currentNode.izquierdo);
    queue.push(currentNode.derecho);
  }

  while (
    treeAsArray.length !== 0 &&
    treeAsArray[treeAsArray.length - 1] === -1
  ) {
    treeAsArray.pop();
  }
  return treeAsArray;
}

function convertArrayToTree(array) {
  if (array.length === 0) {
    return null;
  }

  const root = new Nodo(array[0]);
  const queue = [];
  queue.push(root);

  let i = 1;
  while (i < array.length) {
    const currentNode = queue.shift();

    const leftValue = array[i];
    i++;
    if (leftValue !== -1) {
      currentNode.izquierdo = new Nodo(leftValue);
      queue.push(currentNode.izquierdo);
    }
    if (i < array.length) {
      const rightValue = array[i];
      i++;
      if (rightValue !== -1) {
        currentNode.derecho = new Nodo(rightValue);
        queue.push(currentNode.derecho);
      }
    }
  }
  return root;
}

process.stdin.resume();
process.stdin.setEncoding("utf-8");

let inputString = "";
let currentLine = 0;

process.stdin.on("data", function (inputStdin) {
  inputString += inputStdin;
});

process.stdin.on("end", function () {
  inputString = inputString.split("\n");

  main();
});

function readLine() {
  return inputString[currentLine++];
}

function main() {
  const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

  const inputCount = parseInt(readLine().trim(), 10);

  const arrays = [];

  for (let i = 0; i < inputCount; i++) {
    const arCount = parseInt(readLine().trim(), 10);
    if (arCount === 0) {
      arrays.push([]);
      readLine();
      continue;
    }

    const ar = readLine()
      .replace(/\s+$/g, "")
      .split(" ")
      .map((arTemp) => parseInt(arTemp, 10));
    arrays.push(ar);
  }

  for (let i = 0; i < inputCount; i++) {
    const result = treeToArray(
      invertirArbolBinario(convertArrayToTree(arrays[i])),
    );
    if (i === inputCount - 1) {
      ws.write(result.join(" "));
    } else {
      ws.write(result.join(" ") + "\n");
    }
  }

  ws.end();
}
