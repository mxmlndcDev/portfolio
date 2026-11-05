#!/bin/zsh
# Pasa el material a peso de web dentro de src/.
#   videos: H.264 sin audio, faststart (escritorio a 1280 de ancho, celular a 480)
#   fold/capturas/escenas/foto: WebP
# Uso: zsh tools/web-media.sh [slug]   (sin slug: todo)
set -e
cd "${0:A:h}/.."
FF=${FFMPEG:-$HOME/onda-motion/node_modules/ffmpeg-static/ffmpeg}
SLUGS=(${1:-$(ls media)})

for s in $SLUGS; do
  mkdir -p src/media/$s
  for f in media/$s/*.mp4; do
    b=${f:t:r}
    [[ $b == desk-* ]] && w=1280 || w=480
    $FF -y -loglevel error -i $f -an -vf "scale='min($w,iw)':-2,fps=30" \
      -c:v libx264 -preset slow -crf 29 -pix_fmt yuv420p -movflags +faststart src/media/$s/$b.mp4
  done
  for f in media/$s/*.png media/$s/*.jpg; do
    b=${f:t:r}
    [[ $b == desk-* ]] && w=1280 || w=480
    $FF -y -loglevel error -i $f -vf "scale='min($w,iw)':-2" -c:v libwebp -quality 78 src/media/$s/$b.webp
  done
  echo "listo $s: $(du -sh src/media/$s | cut -f1)"
done

if [[ -z $1 ]]; then
  mkdir -p src/escenas src/img
  for f in assets/escenas/resultados/*.png; do
    $FF -y -loglevel error -i $f -c:v libwebp -quality 82 src/escenas/${f:t:r}.webp
  done
  $FF -y -loglevel error -i brands/referencias/max.jpeg -vf "scale=900:-2" -c:v libwebp -quality 80 src/img/max.webp
  cp assets/escenas/pantallas.json src/escenas/pantallas.json
  python3 -c "import json;d=json.load(open('assets/escenas/pantallas.json'));open('src/escenas/pantallas.js','w').write('// Esquinas de cada pantalla en su escena (sale de assets/escenas/pantallas.json; lo arma tools/web-media.sh).\\nexport default '+json.dumps(d,separators=(',',':'))+';\\n')"
  echo "listo escenas: $(du -sh src/escenas | cut -f1)"
fi
