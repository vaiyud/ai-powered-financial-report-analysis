/**
 * Utilities for detecting and masking Personally Identifiable Information (PII)
 * in free-form text such as financial reports and documents.
 */

export type PiiType =
  | "email"
  | "phone"
  | "ssn"
  | "creditCard"
  | "iban"
  | "ipAddress";

export interface PiiMatch {
  /** The category of PII that was detected. */
  type: PiiType;
  /** The original text that matched. */
  value: string;
  /** Start index of the match within the source string. */
  start: number;
  /** End index (exclusive) of the match within the source string. */
  end: number;
}

export interface MaskPiiOptions {
  /**
   * Which PII types to detect and mask. Defaults to all supported types.
   */
  types?: PiiType[];
  /**
   * Character used to build the mask. Defaults to "*".
   */
  maskChar?: string;
  /**
   * When true, preserves the last N characters of certain identifiers
   * (credit cards, SSNs, IBANs) so masked output stays partially readable,
   * e.g. "****-****-****-1234". Defaults to false (fully masked).
   */
  preserveLast4?: boolean;
}

interface PiiRule {
  type: PiiType;
  regex: RegExp;
}

/**
 * Ordered detection rules. Order matters: more specific patterns (credit
 * cards, IBANs) run before broader ones so their digits are not consumed by a
 * looser matcher.
 */
const PII_RULES: PiiRule[] = [
  {
    type: "email",
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  },
  {
    // 13-19 digit sequences, optionally separated by spaces or hyphens.
    type: "creditCard",
    regex: /\b(?:\d[ -]*?){13,19}\b/g,
  },
  {
    // IBAN: 2 letters, 2 check digits, up to 30 alphanumerics.
    type: "iban",
    regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/g,
  },
  {
    type: "ssn",
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
  },
  {
    // International and North American phone formats.
    type: "phone",
    regex:
      /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{2,4}\)[\s.-]?)?\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}\b/g,
  },
  {
    type: "ipAddress",
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g,
  },
];

const ALL_TYPES: PiiType[] = PII_RULES.map((rule) => rule.type);

const PRESERVE_LAST4_TYPES: ReadonlySet<PiiType> = new Set<PiiType>([
  "creditCard",
  "ssn",
  "iban",
]);

/**
 * Builds the replacement mask for a single matched value.
 */
function buildMask(
  value: string,
  type: PiiType,
  maskChar: string,
  preserveLast4: boolean,
): string {
  const shouldPreserve = preserveLast4 && PRESERVE_LAST4_TYPES.has(type);

  if (!shouldPreserve) {
    // Replace every non-separator character with the mask character so
    // separators (spaces, hyphens, dots, @) keep the shape recognizable.
    return value.replace(/[^\s.@-]/g, maskChar);
  }

  const visibleCount = 4;
  let seen = 0;
  const chars = value.split("");
  // Count total maskable (non-separator) characters.
  const totalMaskable = chars.filter((c) => /[^\s.@-]/.test(c)).length;

  return chars
    .map((char) => {
      if (!/[^\s.@-]/.test(char)) return char;
      seen += 1;
      // Keep the final `visibleCount` maskable characters as-is.
      return seen > totalMaskable - visibleCount ? char : maskChar;
    })
    .join("");
}

/**
 * Finds all PII matches in the given text.
 *
 * @param text The source text to scan.
 * @param types Optional subset of PII types to detect. Defaults to all.
 * @returns A list of matches sorted by their start position.
 */
export function detectPii(text: string, types?: PiiType[]): PiiMatch[] {
  if (!text) return [];

  const enabled = new Set(types ?? ALL_TYPES);
  const matches: PiiMatch[] = [];
  const claimed: boolean[] = new Array(text.length).fill(false);

  for (const rule of PII_RULES) {
    if (!enabled.has(rule.type)) continue;

    // Reset lastIndex for the shared global regex on each pass.
    rule.regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = rule.regex.exec(text)) !== null) {
      const value = match[0];
      const start = match.index;
      const end = start + value.length;

      // Avoid empty matches causing an infinite loop.
      if (value.length === 0) {
        rule.regex.lastIndex += 1;
        continue;
      }

      // Skip if this span overlaps a region already claimed by a more
      // specific rule that ran earlier.
      let overlaps = false;
      for (let i = start; i < end; i += 1) {
        if (claimed[i]) {
          overlaps = true;
          break;
        }
      }
      if (overlaps) continue;

      for (let i = start; i < end; i += 1) claimed[i] = true;
      matches.push({ type: rule.type, value, start, end });
    }
  }

  return matches.sort((a, b) => a.start - b.start);
}

/**
 * Masks all detected PII in the given text.
 *
 * @param text The source text to mask.
 * @param options Masking behavior configuration.
 * @returns The masked text plus metadata about what was detected.
 */
export function maskPii(
  text: string,
  options: MaskPiiOptions = {},
): { masked: string; matches: PiiMatch[] } {
  const { types, maskChar = "*", preserveLast4 = false } = options;

  if (!text) return { masked: text ?? "", matches: [] };

  const matches = detectPii(text, types);
  if (matches.length === 0) return { masked: text, matches };

  // Rebuild the string, replacing matched spans with their masks. Matches are
  // already sorted and non-overlapping.
  let result = "";
  let cursor = 0;

  for (const m of matches) {
    result += text.slice(cursor, m.start);
    result += buildMask(m.value, m.type, maskChar, preserveLast4);
    cursor = m.end;
  }
  result += text.slice(cursor);

  return { masked: result, matches };
}
