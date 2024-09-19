
$fptr = fopen(getenv("OUTPUT_PATH"), "w");

$inputCount = intval(trim(fgets(STDIN)));

$arrays = [];

for ($i = 0; $i < $inputCount; $i++) {
  $longitud = intval(trim(fgets(STDIN)));
  $ar_count = intval(trim(fgets(STDIN)));
  $ar_temp = rtrim(fgets(STDIN));
  $arrays[] = ["precios" => array_map('intval', preg_split('/ /', $ar_temp, -1, PREG_SPLIT_NO_EMPTY)), "longitud" => $longitud];
}

for ($i = 0; $i < $inputCount; $i++) {
  $result = corteDeMayorGanancia($arrays[$i]["precios"], $arrays[$i]["longitud"]);
  // If $i is the last input, do not create a line break
  if ($i == $inputCount - 1) {
    fwrite($fptr, $result);
  } else {
    fwrite($fptr, $result . "\n");
  }
}

fclose($fptr);
