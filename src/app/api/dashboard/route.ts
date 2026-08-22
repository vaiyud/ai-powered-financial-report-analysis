import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    stats: [
      { label: "Documents Analyzed", value: 1284, icon: "FileText" },
      { label: "Financial Metrics Extracted", value: 8942, icon: "TrendingUp" },
      { label: "Risks Detected", value: 23, icon: "ShieldAlert" },
      { label: "Potential Issues", value: 7, icon: "AlertTriangle" },
    ],
    summary: {
      title: "AI Executive Summary",
      description:
        "Based on analysis of 12 financial documents from Q2 2026, the following key metrics were identified:",
      metrics: [
        {
          label: "Revenue",
          value: "$4.2M",
          change: 12.5,
          direction: "up" as const,
        },
        {
          label: "Operating Expenses",
          value: "$2.8M",
          change: 3.2,
          direction: "up" as const,
        },
        {
          label: "Net Profit",
          value: "$1.4M",
          change: 18.7,
          direction: "up" as const,
        },
      ],
    },
    risks: [
      {
        id: 1,
        title: "Revenue concentration risk in Q2 client portfolio",
        severity: "high",
        source: "Annual Report 2026.pdf",
      },
      {
        id: 2,
        title: "Operating margin below industry benchmark by 4.2%",
        severity: "medium",
        source: "Q2 Financial Statement.xlsx",
      },
      {
        id: 3,
        title: "Minor discrepancy in reported vs calculated depreciation",
        severity: "low",
        source: "Balance Sheet Q2.pdf",
      },
    ],
  };

  return NextResponse.json(data);
}
