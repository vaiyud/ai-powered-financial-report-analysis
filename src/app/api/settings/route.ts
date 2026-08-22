import { NextResponse } from "next/server";

// In-memory store for demo purposes. Replace with a database in production.
let settings = {
  workspace: {
    organisation: "Acme Financial Corp",
    reportingCurrency: "USD",
  },
  privacy: {
    maskPii: true,
    dataMinimization: true,
    autoDeleteTemp: false,
    auditTrail: true,
  },
  analysis: {
    anomalyDetection: true,
    requireExplanation: false,
  },
};

export async function GET() {
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const body = await request.json();

  settings = {
    workspace: { ...settings.workspace, ...body.workspace },
    privacy: { ...settings.privacy, ...body.privacy },
    analysis: { ...settings.analysis, ...body.analysis },
  };

  return NextResponse.json(settings);
}
