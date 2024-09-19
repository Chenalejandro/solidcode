
$fptr = fopen(getenv("OUTPUT_PATH"), "w");

$inputCount = intval(trim(fgets(STDIN)));

$arrays = [];

for ($i = 0; $i < $inputCount; $i++) {
  $filas = intval(trim(fgets(STDIN)));
  $columnas = intval(trim(fgets(STDIN)));
  $matrix = [];
  for ($j = 0; $j < $filas; $j++) {
    $ar_temp = rtrim(fgets(STDIN));
    $matrix[] = array_map('intval', preg_split('/ /', $ar_temp, -1, PREG_SPLIT_NO_EMPTY));
  }
  $arrays[] = $matrix;
}

for ($i = 0; $i < $inputCount; $i++) {
  $result = caminoDeMayorGanancia($arrays[$i]);
  // If $i is the last input, do not create a line break
  if ($i == $inputCount - 1) {
    fwrite($fptr, $result);
  } else {
    fwrite($fptr, $result . "\n");
  }
}

fclose($fptr);
