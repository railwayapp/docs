{
  description = "Railway Documentation";
  inputs.nixpkgs.url = github:NixOS/nixpkgs/433c568ba113fff4b6a5832e008f85d52aef7f76;
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
