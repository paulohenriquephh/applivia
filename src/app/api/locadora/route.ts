import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET() {
  const reportPath = join(process.cwd(), "fundacao/locadora/report.json");

  if (!existsSync(reportPath)) {
    try {
      execSync(
        `cd "${process.cwd()}" && python3 fundacao/locadora/simulator.py "${reportPath}"`,
        { timeout: 120000, encoding: "utf-8" }
      );
    } catch (err) {
      return NextResponse.json(
        { error: "Falha ao executar simulador", details: String(err) },
        { status: 500 }
      );
    }
  }

  try {
    const data = JSON.parse(readFileSync(reportPath, "utf-8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Relatório não encontrado" },
      { status: 404 }
    );
  }
}

export async function POST() {
  const reportPath = join(process.cwd(), "fundacao/locadora/report.json");

  try {
    execSync(
      `cd "${process.cwd()}" && python3 fundacao/locadora/simulator.py "${reportPath}"`,
      { timeout: 120000, encoding: "utf-8" }
    );
    const data = JSON.parse(readFileSync(reportPath, "utf-8"));
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Falha ao executar simulador", details: String(err) },
      { status: 500 }
    );
  }
}
