{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20
    pkgs.jq
    pkgs.redli
    pkgs.postgresql
  ];

  shellHook =
  ''
    sudo corepack enable
  '';
}
