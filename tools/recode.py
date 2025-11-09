import sys, json, pathlib, re
from chardet import detect

CANDIDATES = [
  "utf-8",
  "gb18030",  # superset of GBK/CP936
  "cp936",
  "big5",
  "cp1252"
]

CJK_REGEX = re.compile(r"[\u4e00-\u9fff]")


def cjk_ratio(s: str) -> float:
  if not s:
    return 0.0
  cjk = CJK_REGEX.findall(s)
  return len(cjk) / len(s)


def has_replacement_char(raw_bytes: bytes) -> bool:
  # If file already contains U+FFFD when seen as utf-8, it's likely unrecoverable
  try:
    text = raw_bytes.decode("utf-8", errors="replace")
    return "\uFFFD" in text or "�" in text
  except Exception:
    return False


def is_json(path: pathlib.Path) -> bool:
  return path.suffix.lower() == ".json"


def try_recode(path: str) -> None:
  p = pathlib.Path(path)
  raw = p.read_bytes()

  # Unrecoverable marker: contains replacement chars after decode
  if has_replacement_char(raw):
    print(f"[SKIP-UNRECOVERABLE] {path}")
    return

  guess_info = detect(raw)
  guess = guess_info.get("encoding") if guess_info else None

  best_enc = None
  best_ratio = -1.0
  best_text = None

  tried = []
  for enc in ([guess] if guess else []) + CANDIDATES:
    if not enc or enc in tried:
      continue
    tried.append(enc)
    try:
      text = raw.decode(enc)
      ratio = cjk_ratio(text)
      if ratio > best_ratio:
        best_ratio = ratio
        best_enc = enc
        best_text = text
    except Exception:
      continue

  if best_text is None:
    print(f"[FAIL] {path}")
    return

  utf8_text = raw.decode("utf-8", errors="ignore")
  current_ratio = cjk_ratio(utf8_text)

  # Only write if we have a clearly better decoding result
  if best_ratio > current_ratio + 0.01:
    if is_json(p):
      try:
        json.loads(best_text)
      except Exception:
        print(f"[WARN-JSON-STRUCTURE] {path} -> best_enc={best_enc}, JSON parse failed. Not writing.")
        return
    p.write_text(best_text, encoding="utf-8")
    print(f"[FIXED] {path} <- {best_enc}, cjk_ratio={best_ratio:.3f}")
  else:
    print(f"[NO-BETTER] {path} (best={best_enc}, ratio={best_ratio:.3f}, current={current_ratio:.3f})")


if __name__ == "__main__":
  if len(sys.argv) < 2:
    print("Usage: python tools/recode.py <files...>")
    sys.exit(1)
  for file in sys.argv[1:]:
    try:
      try_recode(file)
    except Exception as e:
      print(f"[ERROR] {file}: {e}")
