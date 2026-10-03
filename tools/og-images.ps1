<#
.SYNOPSIS
  Renders a 1200x630 social-preview PNG for every effect into /og.

.DESCRIPTION
  Reads effects-index.js and draws one card per effect with .NET System.Drawing
  (no npm, no browser): dark background, category accent + eyebrow, the effect
  name, and the site name. Uses the Geist TTFs in tools/fonts.

  Run after build-effects-index.js, then build-effect-pages.js (which points each
  page's og:image at og/<cat>-<slug>.png when the file exists):

    powershell -ExecutionPolicy Bypass -File tools/og-images.ps1

  Windows only (System.Drawing). Overwrites existing PNGs.
#>
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$outDir = Join-Path $root 'og'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

# ── Data ────────────────────────────────────────────────────────────────────
$js = Get-Content (Join-Path $root 'effects-index.js') -Raw
$json = [regex]::Replace($js, '(?s)^.*?window\.EFFECTS_INDEX\s*=\s*', '')
$json = [regex]::Replace($json, ';\s*$', '')
$effects = $json | ConvertFrom-Json

$catLabel = @{ typography = 'Typography'; scroll = 'Scroll'; gallery = 'Gallery'; cursor = 'Cursor'; layout = 'Layout' }
$catColor = @{ typography = '#a897e6'; scroll = '#6fb2d6'; gallery = '#e08bb0'; cursor = '#d9b25e'; layout = '#7fc095' }

function Slugify([string]$id) {
  $s = [regex]::Replace($id, '([a-z0-9])([A-Z])', '$1-$2')
  $s = [regex]::Replace($s, '([A-Z])([A-Z][a-z])', '$1-$2')
  return $s.ToLower()
}
function Hex([string]$hex) { return [System.Drawing.ColorTranslator]::FromHtml($hex) }

# ── Fonts ───────────────────────────────────────────────────────────────────
$fonts = New-Object System.Drawing.Text.PrivateFontCollection
$fonts.AddFontFile((Join-Path $root 'tools/fonts/Geist-SemiBold.ttf'))
$fonts.AddFontFile((Join-Path $root 'tools/fonts/Geist-Medium.ttf'))
$famSemi = $fonts.Families | Where-Object { $_.Name -match 'SemiBold' } | Select-Object -First 1
$famMed  = $fonts.Families | Where-Object { $_.Name -match 'Medium' }   | Select-Object -First 1
if (-not $famSemi -or -not $famMed) { throw "Geist families not found. Loaded: $($fonts.Families.Name -join ', ')" }

# ── Layout ──────────────────────────────────────────────────────────────────
$W = 1200; $H = 630; $PAD = 80
$bg    = Hex '#0d0d0f'
$ink   = Hex '#f3f3f5'
$ink2  = Hex '#b5b5bd'
$muted = Hex '#7c7c86'

$count = 0
$perCat = @{}
foreach ($e in $effects) {
  $cat = $e.cat
  if (-not $perCat.ContainsKey($cat)) { $perCat[$cat] = 0 }
  $perCat[$cat]++
  $pos = $perCat[$cat]
  $total = @($effects | Where-Object { $_.cat -eq $cat }).Count
  $accent = Hex $catColor[$cat]

  $bmp = New-Object System.Drawing.Bitmap $W, $H
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
  $g.Clear($bg)

  # Accent bar + eyebrow
  $g.FillRectangle((New-Object System.Drawing.SolidBrush $accent), $PAD, 112, 56, 6)
  # Middle dot via char code: PowerShell 5.1 reads this file as ANSI, so a literal
  # non-ASCII character would render as mojibake.
  $eyebrow = ('{0}  {3}  {1:00} of {2}' -f $catLabel[$cat].ToUpper(), $pos, $total, [char]0x00B7)
  $fEye = New-Object System.Drawing.Font $famMed, 26, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
  $g.DrawString($eyebrow, $fEye, (New-Object System.Drawing.SolidBrush $accent), $PAD, 142)

  # Effect name — shrink until it fits in at most two lines
  $name = $e.name
  $maxW = $W - 2 * $PAD
  $size = 104
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Trimming = [System.Drawing.StringTrimming]::None
  do {
    $fName = New-Object System.Drawing.Font $famSemi, $size, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
    $measured = $g.MeasureString($name, $fName, $maxW, $fmt)
    $lines = [math]::Round($measured.Height / $fName.GetHeight($g))
    if ($lines -le 2 -or $size -le 60) { break }
    $fName.Dispose(); $size -= 8
  } while ($true)
  $rect = New-Object System.Drawing.RectangleF $PAD, 200, $maxW, 300
  $g.DrawString($name, $fName, (New-Object System.Drawing.SolidBrush $ink), $rect, $fmt)

  # Footer
  $fFoot = New-Object System.Drawing.Font $famMed, 28, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
  $g.DrawString('Motion Bench', $fFoot, (New-Object System.Drawing.SolidBrush $ink2), $PAD, 528)
  $url = 'motion-bench.vercel.app'
  $urlW = $g.MeasureString($url, $fFoot).Width
  $g.DrawString($url, $fFoot, (New-Object System.Drawing.SolidBrush $muted), ($W - $PAD - $urlW), 528)

  $file = Join-Path $outDir ("{0}-{1}.png" -f $cat, (Slugify $e.id))
  $bmp.Save($file, [System.Drawing.Imaging.ImageFormat]::Png)

  $fEye.Dispose(); $fName.Dispose(); $fFoot.Dispose(); $g.Dispose(); $bmp.Dispose()
  $count++
}

Write-Host "Rendered $count social images into og/"
