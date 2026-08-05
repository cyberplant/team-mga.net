#!/usr/bin/env bash
#
# Upload de la pagina al hosting via rsync
# Uso: ./upload.sh
#
set -euo pipefail

REMOTE_USER="team_mga"
REMOTE_HOST="roji.net"
REMOTE_PATH="~/team-mga.net/"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)/"

echo "Subiendo pagina a ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}"
echo "Origen: ${LOCAL_DIR}"
echo "---"

rsync -avz --delete \
    --exclude '.git' \
    --exclude '.gitignore' \
    --exclude 'upload.sh' \
    --exclude '.DS_Store' \
    "${LOCAL_DIR}" \
    "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}"

echo "---"
echo "Listo! Pagina en https://team-mga.net/"
