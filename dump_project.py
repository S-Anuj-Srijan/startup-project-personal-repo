import os
from pathlib import Path
import fnmatch

# --------- CONFIG ---------
PROJECT_ROOT = Path(".").resolve()
OUTPUT_FILE = PROJECT_ROOT / "project_code_dump.txt"

# Only include these file types
INCLUDE_EXTENSIONS = {".json", ".ts", ".tsx", ".js", ".py"}

# Ignore directories completely
IGNORE_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "dist-electron",
    "dist-react",
    "build",
    "out",
    "release",
    "win-unpacked",
    "__pycache__",
    ".venv",
    "venv",
    ".idea",
    ".vscode",
}

# 1) Ignore by exact filename (anywhere)
IGNORE_FILENAMES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    
    
}

# 2) Ignore by relative path (from project root)
IGNORE_RELATIVE_PATHS = {
    
}

# 3) Ignore by wildcard patterns
IGNORE_PATTERNS = {
    "*.test.ts",
    "*.spec.ts",
    "*.test.tsx",
}

# Safety limit
MAX_FILE_SIZE_BYTES = 2_000_000  # 2 MB
# --------------------------

def is_ignored_dir(path: Path) -> bool:
    return any(part in IGNORE_DIRS for part in path.parts)

def matches_pattern(path: Path) -> bool:
    return any(fnmatch.fnmatch(path.name, pattern) for pattern in IGNORE_PATTERNS)

def should_include_file(path: Path) -> bool:
    rel_path = path.relative_to(PROJECT_ROOT).as_posix()

    if is_ignored_dir(path):
        return False

    if path.name in IGNORE_FILENAMES:
        return False

    if rel_path in IGNORE_RELATIVE_PATHS:
        return False

    if matches_pattern(path):
        return False

    if path.suffix.lower() not in INCLUDE_EXTENSIONS:
        return False

    try:
        if path.stat().st_size > MAX_FILE_SIZE_BYTES:
            return False
    except OSError:
        return False

    return True

def read_text_file(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="latin-1", errors="replace")
    except Exception as e:
        return f"[ERROR READING FILE: {e}]"

def main():
    files = []
    for p in PROJECT_ROOT.rglob("*"):
        if p.is_file() and should_include_file(p):
            files.append(p)

    files.sort(key=lambda x: str(x).lower())

    with OUTPUT_FILE.open("w", encoding="utf-8") as out:
        out.write(f"PROJECT ROOT: {PROJECT_ROOT}\n")
        out.write(f"TOTAL FILES INCLUDED: {len(files)}\n")
        out.write("=" * 80 + "\n")

        for path in files:
            rel = path.relative_to(PROJECT_ROOT)
            out.write("\n\n")
            out.write(f"===== {rel.as_posix()} =====\n\n")
            out.write(read_text_file(path))

    print(f"Done. Wrote {len(files)} files to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
