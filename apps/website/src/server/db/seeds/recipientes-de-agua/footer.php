
$fptr = fopen(getenv("OUTPUT_PATH"), "w");

$inputCount = intval(trim(fgets(STDIN)));

$arrays = [];

for ($i = 0; $i < $inputCount; $i++) {
  $line = rtrim(fgets(STDIN));
  $capacidadRecipientes = array_map('intval', preg_split('/ /', $line, -1, PREG_SPLIT_NO_EMPTY));
  $line = rtrim(fgets(STDIN));
  $capacidadBaldes = array_map('intval', preg_split('/ /', $line, -1, PREG_SPLIT_NO_EMPTY));

  $arrays[] = [
    "capacidadRecipientes" => $capacidadRecipientes,
    "capacidadBalde1" => $capacidadBaldes[0],
    "capacidadBalde2" => $capacidadBaldes[1]
  ];
}

for ($i = 0; $i < $inputCount; $i++) {
  $result = recipienteDeAgua(
    $arrays[$i]["capacidadRecipientes"],
    $arrays[$i]["capacidadBalde1"],
    $arrays[$i]["capacidadBalde2"]
  );
  // If $i is the last input, do not create a line break
  if ($i == $inputCount - 1) {
    fwrite($fptr, $result);
  } else {
    fwrite($fptr, $result . "\n");
  }
}

fclose($fptr);
