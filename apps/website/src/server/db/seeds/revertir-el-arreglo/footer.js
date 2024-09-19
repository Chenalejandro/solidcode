
process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

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
        const ar = readLine().replace(/\s+$/g, '').split(' ').map(arTemp => parseInt(arTemp, 10));
        arrays.push(ar);
    }

    for (let i = 0; i < inputCount; i++) {
        const result = revertir(arrays[i]);
        if (i === inputCount - 1) {
            ws.write(result.join(" "));
        }
        else {
            ws.write(result.join(" ") + '\n');
        }
    }

    ws.end();
}
