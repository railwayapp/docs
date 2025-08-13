{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/afdcf78bf9115bddc3cb3793e3cfb78ed399fce9.tar.gz") { } }:

let
  inputs = with pkgs;
    [
      nodejs-20_x
      pnpm
    ];
in
pkgs.mkShell
{
  buildInputs = inputs;
}
