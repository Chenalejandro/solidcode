



// function convertArrayToTree(array $arreglo): ?Nodo {
//     if (empty($arreglo)) {
//         return null;
//     }
//     $root = new Nodo($arreglo[0]);
//     $queue = [];
//     array_push($queue, $root);
//     $i = 1;
//     while ($i < sizeof($arreglo)) {
//         $currentNode = array_pop($queue);
//         if ($i < sizeof($arreglo)) {
//             $value = $arreglo[$i];
//             $i++;
//             $currentNode->izquierda = $value === -1 ? null : new Nodo($value);
//             array_push($queue, $currentNode->izquierda);
//         }
//         if ($i < sizeof($arreglo)) {
//             $value = $arreglo[$i];
//             $i++;
//             $currentNode->derecha = $value === -1 ? null : new Nodo($value);
//             array_push($queue, $currentNode->derecha);
//         }
//     }
//     return $root;
// }


function convertArrayToTree(array $arreglo): ?Nodo {
    if (empty($arreglo)) {
        return null;
    }
    $root = new Nodo($arreglo[0]);
    $queue = [];
    array_push($queue, $root);
    $i = 1;
    while ($i < sizeof($arreglo)) {
        $currentNode = array_shift($queue);

        $leftValue = $arreglo[$i];
        $i++;
        if ($leftValue !== -1) {
            $currentNode->izquierda = new Nodo($leftValue);
            array_push($queue, $currentNode->izquierda);
        }

        if ($i < sizeof($arreglo)) {
            $rightValue = $arreglo[$i];
            $i++;
            if ($rightValue !== -1) {
                $currentNode->derecha = $rightValue === -1 ? null : new Nodo($rightValue);
                array_push($queue, $currentNode->derecha);
            }
        }
    }
    return $root;
}

$fptr = fopen(getenv("OUTPUT_PATH"), "w");

$inputCount = intval(trim(fgets(STDIN)));

$arrays = [];

for ($i = 0; $i < $inputCount; $i++) {
    $ar_count = intval(trim(fgets(STDIN)));
    if ($ar_count === 0) {
        fgets(STDIN);
        $arrays[] = [];
        continue;
    }
    $ar_temp = rtrim(fgets(STDIN));
    $arrays[] = array_map('intval', preg_split('/ /', $ar_temp, -1, PREG_SPLIT_NO_EMPTY));
}

for ($i = 0; $i < $inputCount; $i++) {
    $result = recorridoDeArbolBinarioEnOrden(convertArrayToTree($arrays[$i]));
    // If $i is the last input, do not create a line break
    if ($i == $inputCount - 1) {
        fwrite($fptr, implode(' ', $result));
    } else {
        fwrite($fptr, implode(' ', $result) . "\n");
    }
}

fclose($fptr);
