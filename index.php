<?php
$archivoAnterior = 'registro.txt';
$archivoActual   = 'registro_temp.txt';

// 1. Leer el archivo anterior (si no existe, iniciamos en 0)
if (file_exists($archivoAnterior)) {
    $valorAnterior = (int) file_get_contents($archivoAnterior);
} else {
    $valorAnterior = 0;
}

// 2. Incrementar el valor y guardarlo en el archivo temporal
$valorActual = $valorAnterior + 1;
file_put_contents($archivoActual, $valorActual);

// 3. Renombrar el archivo temporal reemplazando al anterior
// (rename sobreescribe automáticamente el archivo de destino en la mayoría de sistemas)
rename($archivoActual, $archivoAnterior);

require_once 'mga.html';
?>