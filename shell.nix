{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/433c568ba113fff4b6a5832e008f85d52aef7f76.tar.gz") { } }:

let
  inputs = with pkgs;
    [
      nodejs-16_x
      yarn
    ];
in
pkgs.mkShell
{
  buildInputs = inputs;
}
