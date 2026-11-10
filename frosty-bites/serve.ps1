# serve.ps1 - Servidor estatico para Frosty Bites (sin Node ni Python)
# Uso: powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
# Detener: Ctrl+C (o cerrar la ventana)

param(
    [string]$Root = $PSScriptRoot,
    [int]$Port = 3000
)

$ErrorActionPreference = 'Stop'
$rootFull = [System.IO.Path]::GetFullPath($Root)

$types = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.mjs'  = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.map'  = 'application/json; charset=utf-8'
    '.svg'  = 'image/svg+xml'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.webp' = 'image/webp'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.ttf'  = 'font/ttf'
    '.mp4'  = 'video/mp4'
    '.webm' = 'video/webm'
    '.txt'  = 'text/plain; charset=utf-8'
    '.md'   = 'text/plain; charset=utf-8'
    '.pdf'  = 'application/pdf'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try {
    $listener.Start()
} catch {
    Write-Host "ERROR: no se pudo escuchar en el puerto ${Port}: $($_.Exception.Message)"
    exit 1
}

Write-Host "Sirviendo $rootFull"
Write-Host "Listo en http://localhost:$Port/  (Ctrl+C para detener)"

while ($listener.IsListening) {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $res  = $ctx.Response
    $status = 200
    $bytes  = $null
    $file   = $null

    try {
        $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath).Trim('/')
        if ($rel -eq '') { $rel = 'index.html' }
        $rel  = $rel.Replace('/', '\')
        $file = [System.IO.Path]::GetFullPath((Join-Path $rootFull $rel))

        $dentro = $file.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)

        if (-not $dentro) {
            $status = 403
        } elseif ([System.IO.Directory]::Exists($file)) {
            $file = Join-Path $file 'index.html'
        }

        if ($status -eq 200 -and [System.IO.File]::Exists($file)) {
            $bytes = [System.IO.File]::ReadAllBytes($file)
            $ext = [System.IO.Path]::GetExtension($file).ToLowerInvariant()
            if ($types.ContainsKey($ext)) { $res.ContentType = $types[$ext] }
            else { $res.ContentType = 'application/octet-stream' }
        } elseif ($status -eq 200) {
            $status = 404
        }
    } catch {
        $status = 500
    }

    if ($null -eq $bytes) {
        if     ($status -eq 404) { $msg = '404 No encontrado' }
        elseif ($status -eq 403) { $msg = '403 Prohibido' }
        else                     { $msg = '500 Error interno' }
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
        $res.ContentType = 'text/plain; charset=utf-8'
    }

    $res.StatusCode = $status
    $res.Headers['Cache-Control'] = 'no-cache'
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.OutputStream.Close()

    Write-Host ("{0} {1} -> {2}" -f $req.HttpMethod, $req.Url.AbsolutePath, $status)
}
