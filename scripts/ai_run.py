from pathlib import Path
import json
import sys

def main():
    # Hardcoded output file (place this in scripts/)
    scripts_dir = Path(__file__).resolve().parent
    out_file = scripts_dir / "output_blueprint.png"  # change if your file name differs

    # Print absolute path so Electron can load it via file://
    print(str(out_file))

if __name__ == "__main__":
    main()
