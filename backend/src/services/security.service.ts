import { prisma } from '../config/db';
import { ISecurityScanner } from '../adapters/security/scanner.interface';
import { skillSpectorAdapter } from '../adapters/security/skillspector.adapter';
import { NotFoundError } from '../utils/errors';

export class SecurityService {
  private scanner: ISecurityScanner;

  /**
   * Dependency Injection: Allows plugging in different scanners (e.g. for testing)
   */
  constructor(scanner: ISecurityScanner = skillSpectorAdapter) {
    this.scanner = scanner;
  }

  /**
   * Performs automated security scan on a published skill version.
   * Saves the result into the SecurityAssessment table.
   */
  async scanSkillVersion(skillVersionId: string) {
    const version = await prisma.skillVersion.findUnique({
      where: { id: skillVersionId },
    });

    if (!version) {
      throw new NotFoundError('SkillVersion', skillVersionId);
    }

    // Run the scanner adapter on the version instructions
    const scanResult = await this.scanner.scan(version.readmeContent || '');

    // Upsert into database
    const assessment = await prisma.securityAssessment.upsert({
      where: { skillVersionId },
      update: {
        scannerName: scanResult.scannerName,
        scannerVersion: scanResult.scannerVersion,
        status: scanResult.status,
        score: scanResult.score,
        findings: JSON.stringify(scanResult.findings),
        limitations: scanResult.limitations,
        completedAt: scanResult.completedAt,
      },
      create: {
        skillVersionId,
        scannerName: scanResult.scannerName,
        scannerVersion: scanResult.scannerVersion,
        status: scanResult.status,
        score: scanResult.score,
        findings: JSON.stringify(scanResult.findings),
        limitations: scanResult.limitations,
        completedAt: scanResult.completedAt,
      },
    });

    return {
      ...assessment,
      findings: scanResult.findings, // Return parsed JSON array to caller
    };
  }

  /**
   * Retrieves security assessment report for a specific skill and version.
   */
  async getAssessment(slug: string, versionStr: string) {
    const version = await prisma.skillVersion.findFirst({
      where: {
        version: versionStr,
        skill: { slug },
      },
      include: {
        securityAssessment: true,
        skill: { select: { name: true, slug: true } },
      },
    });

    if (!version) {
      throw new NotFoundError(`Version '${versionStr}' for skill '${slug}'`);
    }

    if (!version.securityAssessment) {
      return {
        status: 'NOT_SCANNED',
        score: null,
        findings: [],
        message: 'Security assessment has not been performed on this version yet.',
      };
    }

    return {
      ...version.securityAssessment,
      findings: version.securityAssessment.findings
        ? JSON.parse(version.securityAssessment.findings)
        : [],
    };
  }
}

export const securityService = new SecurityService();
