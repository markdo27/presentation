"""Compatibility launcher. Never serve this folder as a static directory."""
from pathlib import Path
import subprocess

if __name__ == '__main__':
    raise SystemExit(subprocess.call(
        ['node', '--env-file-if-exists=.env', 'server.mjs'],
        cwd=Path(__file__).resolve().parent,
    ))
