Add-Type -AssemblyName System.Drawing

$dir = "public/trustees"
if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force
}

$img01Path = Resolve-Path "public/migrated/01.jpg"
$img01 = [System.Drawing.Bitmap]::FromFile($img01Path)

function Crop-Image($bmp, [int]$x, [int]$y, [int]$w, [int]$h, [string]$outPath) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $bmp.Clone($rect, $bmp.PixelFormat)
    $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $cropped.Dispose()
}

# 1. Person 1 (Rev. J. Xavier Paulraj)
Crop-Image $img01 5 15 220 315 "public/trustees/trustee-10-xavier-paulraj.jpg"

# 2. Person 5 (Rev. Dr. R. John Durai)
Crop-Image $img01 880 15 220 315 "public/trustees/trustee-2-john-durai.jpg"

# 3. Person 7 (Rev. J.A.D. Samuel)
Crop-Image $img01 1270 15 225 315 "public/trustees/trustee-3-jad-samuel.jpg"

$img01.Dispose()

# Also let's check 03.jpg
$img03Path = Resolve-Path "public/migrated/03.jpg"
$img03 = [System.Drawing.Bitmap]::FromFile($img03Path)
# In 03.jpg, person 2 is Rev. Dr. R. John Durai in formal coat/tie
# 03.jpg size
Write-Host "03.jpg size: $($img03.Width) x $($img03.Height)"
$img03.Dispose()

Write-Host "Successfully cropped trustee photos."
