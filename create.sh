#!/bin/bash

set -euo pipefail

echo "💬 Installing Bun"
curl -fsSL https://bun.sh/install | bash
source /home/node/.bashrc

echo "💬 Installing emscripten"
cd ~
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh

echo "💬 Installing clangd"
sudo apt update
sudo apt-get install clangd-19
sudo update-alternatives --install /usr/bin/clangd clangd /usr/bin/clangd-19 100