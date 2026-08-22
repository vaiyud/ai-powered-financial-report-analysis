import { NextResponse } from "next/server";
import { maskPii, type MaskPiiOptions, type PiiType } from "@/lib/pii";

export const runtime = "nodejs";

const SUPPORTED_TYPES: PiiType[] = [
  "email",
  "phone",
  "ssn",
  "creditCard",
  "iban",
  "ipAddress",
];

interface MaskPiiRequestBody {
  text?: unknown;
  types?: unknown;
  maskChar?: unknown;
  preserveLast4?: unknown;
}

function isPiiType(value: unknown): value is PiiType {
  return typeof value === "string" && (SUPPORTED_TYPES as string[]).includes(value);
}

/**
 * POST /api/documents/mask-pii
 *
 * Body:
 *   {
 *     "text": string,                 // required
 *     "types"?: PiiType[],            // optional subset of PII types
 *     "maskChar"?: string,            // optional single mask character
 *     "preserveLast4"?: boolean       // optional partial masking
 *   }
 *
 * Response:
 *   {
 *     "masked": string,
 *     "matches": { type, value, start, end }[],
 *     "count": number
 *   }
 */
export async function POST(request: Request) {
  let body: MaskPiiRequestBody;

  try {
    body = (await request.json()) as MaskPiiRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (typeof body.text !== "string") {
    return NextResponse.json(
      { error: "Field 'text' is required and must be a string." },
      { status: 400 },
    );
  }

  const options: MaskPiiOptions = {};

  if (body.types !== undefined) {
    if (!Array.isArray(body.types) || !body.types.every(isPiiType)) {
      return NextResponse.json(
        {
          error: `Field 'types' must be an array of: ${SUPPORTED_TYPES.join(", ")}.`,
        },
        { status: 400 },
      );
    }
    options.types = body.types as PiiType[];
  }

  if (body.maskChar !== undefined) {
    if (typeof body.maskChar !== "string" || body.maskChar.length !== 1) {
      return NextResponse.json(
        { error: "Field 'maskChar' must be a single character." },
        { status: 400 },
      );
    }
    options.maskChar = body.maskChar;
  }

  if (body.preserveLast4 !== undefined) {
    if (typeof body.preserveLast4 !== "boolean") {
      return NextResponse.json(
        { error: "Field 'preserveLast4' must be a boolean." },
        { status: 400 },
      );
    }
    options.preserveLast4 = body.preserveLast4;
  }

  const { masked, matches } = maskPii(body.text, options);

  return NextResponse.json({
    masked,
    matches,
    count: matches.length,
  });
}
