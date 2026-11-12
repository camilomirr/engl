# ==========================================
# PC HARDWARE LOCAL API
# Servidor local de consulta de hardware
# Versión 1.1 (NVISION / PC3D)
#
# Basado en el puente original del equipo. Cambios de la 1.1:
# - Solo acepta peticiones del navegador desde NVISION
#   (https://nvision.social) y desde este mismo equipo
#   (localhost / 127.0.0.1). Cualquier otro sitio recibe 403.
#   Antes aceptaba cualquier origen (*).
# - Si una consulta de hardware falla, devuelve el resto de
#   los datos con una lista de advertencias, en vez de
#   quedarse sin responder.
# - Tiempos de espera en cada conexión: una conexión que no
#   envía nada ya no bloquea el servidor para siempre.
# - Cierre de conexiones corregido y mensaje claro cuando el
#   puerto ya está en uso (otro puente o JARVIS abierto).
# La respuesta JSON conserva los mismos campos de la versión
# original y agrega "version" y "advertencias".
# Solo Windows. Los datos nunca salen de este equipo.
# ==========================================

$PORT = 8765
$BIND_ADDRESS = "127.0.0.1"
$BRIDGE_VERSION = "1.1"

# ==========================================
# ORIGENES PERMITIDOS (CORS)
# ==========================================

function Test-AllowedOrigin {
    param(
        [string]$Origin
    )

    if ($Origin -match '^https://(www\.)?nvision\.social$') {
        return $true
    }
    if ($Origin -match '^http://(localhost|127\.0\.0\.1)(:\d+)?$') {
        return $true
    }
    if ($Origin -eq 'null') {
        return $true
    }
    return $false
}

# ==========================================
# OBTENER INFORMACION DEL HARDWARE
# ==========================================

$script:hardwareWarnings = @()

function Get-CimSafe {
    param(
        [string]$ClassName
    )

    try {
        $result = Get-CimInstance -ClassName $ClassName -ErrorAction Stop
        return @($result)
    }
    catch {
        $script:hardwareWarnings += "No se pudo leer $ClassName"
        return @()
    }
}

function Get-HardwareData {

    $script:hardwareWarnings = @()

    $os = Get-CimSafe 'Win32_OperatingSystem' | Select-Object -First 1
    $cpu = Get-CimSafe 'Win32_Processor' | Select-Object -First 1
    $ramModules = @(Get-CimSafe 'Win32_PhysicalMemory')

    $ramTotalBytes = ($ramModules | Measure-Object -Property Capacity -Sum).Sum
    if ($null -eq $ramTotalBytes) {
        $ramTotalBytes = 0
    }

    $ramTotalGB = [math]::Round($ramTotalBytes / 1GB, 2)

    $ram = foreach ($module in $ramModules) {

        [PSCustomObject]@{
            fabricante = $module.Manufacturer
            capacidadGB = [math]::Round($module.Capacity / 1GB, 2)
            velocidadMHz = $module.Speed
            tipo = switch ($module.SMBIOSMemoryType) {
                20 { "DDR" }
                21 { "DDR2" }
                24 { "DDR3" }
                26 { "DDR4" }
                34 { "DDR5" }
                default { "Desconocido" }
            }
        }
    }

    $gpu = @(Get-CimSafe 'Win32_VideoController' | ForEach-Object {

        [PSCustomObject]@{
            nombre = $_.Name
            fabricante = $_.AdapterCompatibility
            memoriaGB = if ($_.AdapterRAM) {
                [math]::Round($_.AdapterRAM / 1GB, 2)
            } else {
                0
            }
            driver = $_.DriverVersion
        }
    })

    $disks = @(Get-CimSafe 'Win32_DiskDrive' | ForEach-Object {

        [PSCustomObject]@{
            modelo = $_.Model
            fabricante = $_.Manufacturer
            capacidadGB = [math]::Round($_.Size / 1GB, 2)
            interfaz = $_.InterfaceType
            tipo = $_.MediaType
        }
    })

    $opticalDrives = @(Get-CimSafe 'Win32_CDROMDrive' | ForEach-Object {

        [PSCustomObject]@{
            nombre = $_.Name
            fabricante = $_.Manufacturer
            unidad = $_.Drive
        }
    })

    $motherboard = Get-CimSafe 'Win32_BaseBoard' | Select-Object -First 1

    return [PSCustomObject]@{

        version = $BRIDGE_VERSION

        advertencias = @($script:hardwareWarnings)

        equipo = @{
            nombre = $env:COMPUTERNAME
        }

        sistema = @{
            nombre = $os.Caption
            version = $os.Version
            arquitectura = $os.OSArchitecture
        }

        procesador = @{
            nombre = $cpu.Name
            fabricante = $cpu.Manufacturer
            nucleos = $cpu.NumberOfCores
            hilos = $cpu.NumberOfLogicalProcessors
            frecuenciaMHz = $cpu.MaxClockSpeed
        }

        memoria = @{
            totalGB = $ramTotalGB
            modulos = @($ram)
        }

        graficos = @($gpu)

        almacenamiento = @($disks)

        unidadOptica = @($opticalDrives)

        placaMadre = @{
            fabricante = $motherboard.Manufacturer
            modelo = $motherboard.Product
            version = $motherboard.Version
        }

        fechaConsulta = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }
}

# ==========================================
# RESPONDER AL NAVEGADOR
# ==========================================

function Send-Response {

    param(
        $Client,
        [int]$StatusCode,
        [string]$StatusText,
        [string]$ContentType,
        [string]$Body,
        [string]$Origin = '',
        [bool]$AllowCors = $true
    )

    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($Body)
    $stream = $Client.GetStream()

    $headers = "HTTP/1.1 $StatusCode $StatusText`r`n"
    $headers += "Content-Type: $ContentType; charset=utf-8`r`n"
    $headers += "Content-Length: $($bodyBytes.Length)`r`n"
    if ($AllowCors) {
        $allowOrigin = if ($Origin) { $Origin } else { '*' }
        $headers += "Access-Control-Allow-Origin: $allowOrigin`r`n"
        $headers += "Access-Control-Allow-Methods: GET, OPTIONS`r`n"
        $headers += "Access-Control-Allow-Headers: Content-Type`r`n"
    }
    $headers += "Access-Control-Allow-Private-Network: true`r`n"
    $headers += "Connection: close`r`n"
    $headers += "`r`n"

    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)

    $stream.Write($headerBytes, 0, $headerBytes.Length)
    $stream.Write($bodyBytes, 0, $bodyBytes.Length)
    $stream.Flush()
}

# ==========================================
# INICIAR SERVIDOR
# ==========================================

$serverListener = [System.Net.Sockets.TcpListener]::new(
    [System.Net.IPAddress]::Parse($BIND_ADDRESS),
    $PORT
)

$started = $false

try {

    $serverListener.Start()
    $started = $true

    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "       PC HARDWARE LOCAL API v$BRIDGE_VERSION" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Servidor iniciado correctamente." -ForegroundColor Green
    Write-Host "Direccion: http://127.0.0.1:$PORT"
    Write-Host "API: http://127.0.0.1:$PORT/api/hardware" -ForegroundColor Yellow
    Write-Host "Solo acepta peticiones de NVISION y de este equipo."
    Write-Host ""
    Write-Host "Presiona CTRL + C para detener el servidor."
    Write-Host ""

    while ($true) {

        $client = $null

        try {

            $client = $serverListener.AcceptTcpClient()
            $client.ReceiveTimeout = 10000
            $client.SendTimeout = 10000

            $stream = $client.GetStream()
            $reader = New-Object System.IO.StreamReader($stream)

            $requestLine = $reader.ReadLine()

            $origin = ''
            while ($true) {
                $line = $reader.ReadLine()
                if ($null -eq $line -or $line -eq '') {
                    break
                }
                if ($line -match '^Origin:\s*(.+?)\s*$') {
                    $origin = $Matches[1]
                }
            }

            if ($null -ne $requestLine -and $requestLine -ne '') {

                $originAllowed = ($origin -eq '') -or (Test-AllowedOrigin $origin)

                if (-not $originAllowed) {

                    Write-Host "Peticion rechazada: origen no permitido ($origin)." -ForegroundColor Yellow

                    Send-Response -Client $client -StatusCode 403 -StatusText "Forbidden" -ContentType "text/plain" -Body "Origen no permitido." -AllowCors $false

                }
                elseif ($requestLine -match "^OPTIONS") {

                    Send-Response -Client $client -StatusCode 204 -StatusText "No Content" -ContentType "text/plain" -Body "" -Origin $origin

                }
                elseif ($requestLine -match "^GET /api/hardware") {

                    Write-Host "Consulta de hardware recibida." -ForegroundColor Green

                    try {
                        $data = Get-HardwareData
                        $json = $data | ConvertTo-Json -Depth 10

                        Send-Response -Client $client -StatusCode 200 -StatusText "OK" -ContentType "application/json" -Body $json -Origin $origin
                    }
                    catch {
                        Write-Host "Error al leer el hardware: $($_.Exception.Message)" -ForegroundColor Red

                        Send-Response -Client $client -StatusCode 500 -StatusText "Internal Server Error" -ContentType "application/json" -Body '{"error":"No se pudo leer el hardware"}' -Origin $origin
                    }

                }
                elseif ($requestLine -match "^GET /") {

                    $message = "PC Hardware Local API funcionando correctamente."

                    Send-Response -Client $client -StatusCode 200 -StatusText "OK" -ContentType "text/plain" -Body $message -Origin $origin

                }
                else {

                    Send-Response -Client $client -StatusCode 404 -StatusText "Not Found" -ContentType "text/plain" -Body "Endpoint no encontrado." -Origin $origin

                }
            }

        }
        catch {

            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red

        }
        finally {

            if ($null -ne $client) {
                try { $client.Close() } catch { }
            }

        }
    }
}
catch {

    Write-Host ""
    Write-Host "No se pudo iniciar el servidor." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Si el puerto $PORT ya esta en uso, cierra el otro programa (otro puente o JARVIS) e intentalo de nuevo."

}
finally {

    if ($started) {
        try { $serverListener.Stop() } catch { }
        Write-Host "Servidor detenido." -ForegroundColor Yellow
    }

}
