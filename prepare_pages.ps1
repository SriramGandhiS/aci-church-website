Add-Type -AssemblyName System.Drawing

$src = "c:\Users\iamra\OneDrive\Desktop\aruvamanai\public\official-forms\app_page_4.png"
$img = [System.Drawing.Image]::FromFile($src)
# Rotate 270 degrees (or 90) clockwise
$img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone)
$dst = "c:\Users\iamra\OneDrive\Desktop\aruvamanai\public\official-forms\page_4.png"
$img.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()

# Also copy page 1, 2, 3 to standard names page_1.png, page_2.png, page_3.png
Copy-Item "c:\Users\iamra\OneDrive\Desktop\aruvamanai\public\official-forms\app_page_1.png" "c:\Users\iamra\OneDrive\Desktop\aruvamanai\public\official-forms\page_1.png"
Copy-Item "c:\Users\iamra\OneDrive\Desktop\aruvamanai\public\official-forms\app_page_2.png" "c:\Users\iamra\OneDrive\Desktop\aruvamanai\public\official-forms\page_2.png"
Copy-Item "c:\Users\iamra\OneDrive\Desktop\aruvamanai\public\official-forms\app_page_3.png" "c:\Users\iamra\OneDrive\Desktop\aruvamanai\public\official-forms\page_3.png"

Write-Host "All 4 pages prepared successfully."
