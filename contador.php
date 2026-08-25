<?php
header('Content-Type: text/plain; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$archivo = __DIR__ . '/registro.txt';
$fp = @fopen($archivo, 'c+');

if ($fp === false) {
    http_response_code(503);
    exit('');
}

if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    http_response_code(503);
    exit('');
}

rewind($fp);
$contenido = stream_get_contents($fp);
$valorAnterior = is_numeric(trim($contenido)) ? (int) trim($contenido) : 0;
$valorActual = $valorAnterior + 1;

rewind($fp);
ftruncate($fp, 0);
fwrite($fp, (string) $valorActual);
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

echo $valorActual;
?>
