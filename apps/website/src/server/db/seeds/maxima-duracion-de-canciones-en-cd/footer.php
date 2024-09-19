
$fptr = fopen(getenv("OUTPUT_PATH"), "w");

$inputCount = intval(trim(fgets(STDIN)));

$arrays = [];

for ($i = 0; $i < $inputCount; $i++) {
  $capacidad = intval(trim(fgets(STDIN)));
  $ar_count = intval(trim(fgets(STDIN)));
  $ar_temp = rtrim(fgets(STDIN));
  $arrays[] = ["duraciones" => array_map('intval', preg_split('/ /', $ar_temp, -1, PREG_SPLIT_NO_EMPTY)), "capacidad" => $capacidad];
}

for ($i = 0; $i < $inputCount; $i++) {
  $result = maximaDuracionDeCancionesEnCd($arrays[$i]["duraciones"], $arrays[$i]["capacidad"]);
  // If $i is the last input, do not create a line break
  if ($i == $inputCount - 1) {
    fwrite($fptr, $result);
  } else {
    fwrite($fptr, $result . "\n");
  }
}

fclose($fptr);
