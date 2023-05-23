{
  description = "Railway Documentation";
  inputs.nixpkgs.url = github:NixOS/nixpkgs/afdcf78bf9115bddc3cb3793e3cfb78ed399fce9;
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = import nixpkgs {
            inherit system;
          };
        in
        {
          devShells.default =
            import ./shell.nix { inherit pkgs; };
        }
      );
}
