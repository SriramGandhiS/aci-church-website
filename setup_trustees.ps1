$brainDir = "C:\Users\ELCOT\.gemini\antigravity-ide\brain\4ed2b98b-bf4e-43c0-a4f4-0151dec141bd"
$targetDir = "public/trustees"

if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force
}

# 1. The Most Rev. S. Johnson Durai
Copy-Item "public/archbishop_new.jpg" "$targetDir/trustee-1-johnson-durai.jpg" -Force

# 2. Rev. Dr. R. John Durai (already cropped)
# 3. Rev. J.A.D. Samuel (already cropped)

# 4. Rt. Rev. Dr. L. Suresh Daniel
Copy-Item "public/dioceses/bishop-4.jpg" "$targetDir/trustee-4-suresh-daniel.jpg" -Force

# 5. Rt. Rev. John Samuel
$jsImg = Get-Item "$brainDir\trustee_john_samuel*.jpg" | Select-Object -First 1
if ($jsImg) {
    Copy-Item $jsImg.FullName "$targetDir/trustee-5-john-samuel.jpg" -Force
}

# 6. Rt. Rev. S. Anand
Copy-Item "public/dioceses/bishop-2.jpg" "$targetDir/trustee-6-s-anand.jpg" -Force

# 7. Rt. Rev. A. Pounraj
Copy-Item "public/dioceses/bishop-3.jpg" "$targetDir/trustee-7-a-pounraj.jpg" -Force

# 8. Rt. Rev. G. Edwin Joseph Selvaraj
Copy-Item "public/dioceses/bishop-5.jpg" "$targetDir/trustee-8-edwin-joseph.jpg" -Force

# 9. Rev. D. V. Isaac Timothy
$itImg = Get-Item "$brainDir\trustee_isaac_timothy*.jpg" | Select-Object -First 1
if ($itImg) {
    Copy-Item $itImg.FullName "$targetDir/trustee-9-isaac-timothy.jpg" -Force
}

# 10. Rev. J. Xavier Paulraj (already cropped)

Get-ChildItem $targetDir | Select-Object Name, Length
