import { ISecurityScanner, ScanResult, SecurityFinding } from './scanner.interface';
import { SECURITY_RULES } from './rules';

/**
 * Concrete Adapter for NVIDIA SkillSpector Security Analysis.
 * Implements ISecurityScanner interface (Adapter Pattern).
 */
export class SkillSpectorAdapter implements ISecurityScanner {
  public readonly name = 'skillspector';
  public readonly version = '1.2.0';

  async scan(content: string): Promise<ScanResult> {
    const findings: SecurityFinding[] = [];
    const lines = content.split('\n');

    // Analyze line-by-line for exact line numbers and patterns
    lines.forEach((lineText, index) => {
      const lineNumber = index + 1;

      for (const rule of SECURITY_RULES) {
        if (rule.pattern.test(lineText)) {
          findings.push({
            id: `${rule.id}-${lineNumber}`,
            severity: rule.severity,
            title: rule.title,
            description: rule.description,
            matchedPattern: lineText.trim(),
            line: lineNumber,
            remediation: rule.remediation,
          });
        }
      }
    });

    // Score calculation: starts at 100 and deducts points based on finding severity
    let score = 100;
    for (const f of findings) {
      switch (f.severity) {
        case 'CRITICAL':
          score -= 50;
          break;
        case 'HIGH':
          score -= 30;
          break;
        case 'MEDIUM':
          score -= 15;
          break;
        case 'LOW':
          score -= 5;
          break;
      }
    }
    score = Math.max(0, score); // Never drop below 0

    // Explicit Status (SRS FR-006):
    const status = findings.length === 0 ? 'CLEAN' : 'FINDINGS_DETECTED';

    return {
      scannerName: this.name,
      scannerVersion: this.version,
      status,
      score,
      findings,
      limitations:
        'Static rule-based scan covering shell commands, prompt injections, and secret exposure. Does not execute code in runtime sandbox.',
      completedAt: new Date(),
    };
  }
}

export const skillSpectorAdapter = new SkillSpectorAdapter();
