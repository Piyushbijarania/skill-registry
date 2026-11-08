/**
 * Security Finding representation
 */
export interface SecurityFinding {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  matchedPattern?: string;
  line?: number;
  remediation: string;
}

/**
 * Normalized Security Scan Result
 */
export interface ScanResult {
  scannerName: string;
  scannerVersion: string;
  status: 'CLEAN' | 'FINDINGS_DETECTED' | 'SCAN_FAILED';
  score: number; // 0 to 100
  findings: SecurityFinding[];
  limitations: string;
  completedAt: Date;
}

/**
 * Scanner Interface contract.
 * Supported scanners implement this interface.
 */
export interface ISecurityScanner {
  readonly name: string;
  readonly version: string;
  scan(content: string): Promise<ScanResult>;
}
