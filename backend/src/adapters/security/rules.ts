export interface SecurityRule {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  pattern: RegExp;
  remediation: string;
}

/**
 * Static Analysis Security Rules for AI Agent Skills
 * Detects malicious shell commands, credential exfiltration, and prompt injections.
 */
export const SECURITY_RULES: SecurityRule[] = [
  // 1. Destructive Commands (CRITICAL)
  {
    id: 'SEC-001',
    severity: 'CRITICAL',
    title: 'Destructive File Deletion Detected',
    description: 'Skill contains dangerous root or recursive wipe commands (e.g., rm -rf /).',
    pattern: /\brm\s+-[a-zA-Z]*(?:rf|fr|r\s+-f|f\s+-r)[a-zA-Z]*\s+(?:\/|~\/|\.\/|\*|\$HOME)(?:\s|$|[;&|])/i,
    remediation: 'Specify targeted, safe directory paths and never run recursive deletion on root or home directories.',
  },
  {
    id: 'SEC-002',
    severity: 'CRITICAL',
    title: 'Drive Formatting / Block Device Manipulation',
    description: 'Skill contains commands to overwrite disk drives or filesystem tables.',
    pattern: /\b(?:mkfs|fdisk|parted|dd\s+if=.*of=\/dev\/[sh]d[a-z])\b/i,
    remediation: 'Remove commands that format or raw-write to block devices.',
  },

  // 2. Reverse Shells & Unsafe Pipe Execution (CRITICAL / HIGH)
  {
    id: 'SEC-003',
    severity: 'CRITICAL',
    title: 'Unverified Pipe-to-Shell Execution',
    description: 'Piping web content directly into bash or sh (curl ... | bash) allows remote code execution.',
    pattern: /\b(?:curl|wget)[^|\n]+\|\s*(?:bash|sh|zsh)\b/i,
    remediation: 'Download scripts to disk, verify their SHA-256 checksum, and inspect contents before execution.',
  },
  {
    id: 'SEC-004',
    severity: 'HIGH',
    title: 'Potential Reverse Shell or Network Socket',
    description: 'Attempts to open direct TCP sockets or netcat interactive shells.',
    pattern: /\b(?:nc\s+-[el]|bash\s+-i\s+>&|\/dev\/tcp\/\d+)/i,
    remediation: 'Use sanctioned HTTP/REST clients and avoid raw shell socket redirection.',
  },

  // 3. Credential Exposure & Secret Harvesting (HIGH / MEDIUM)
  {
    id: 'SEC-005',
    severity: 'HIGH',
    title: 'SSH Key or Sensitive Credential Exposure',
    description: 'Accessing private SSH keys or user credentials (.ssh/id_rsa, .bash_history).',
    pattern: /(?:\.ssh\/id_rsa|\.aws\/credentials|\.bash_history|\/etc\/shadow)/i,
    remediation: 'Never hardcode paths to private keys or machine credential stores in skill files.',
  },
  {
    id: 'SEC-006',
    severity: 'MEDIUM',
    title: 'Environment Variable Exfiltration Attempt',
    description: 'Sending raw environment variables (which often contain API secrets) to external hosts.',
    pattern: /\b(?:curl|fetch|axios)[^;\n]+(?:\$env|process\.env|printenv|env\s*\|)/i,
    remediation: 'Whitelist only the specific parameters required by the API. Never dump the entire environment.',
  },

  // 4. Prompt Injections & Jailbreak Attempts (MEDIUM)
  {
    id: 'SEC-007',
    severity: 'MEDIUM',
    title: 'Potential Prompt Injection Instruction',
    description: 'Instructions attempting to override safety guardrails or system instructions.',
    pattern: /(?:ignore\s+all\s+(?:previous|prior)\s+instructions|disregard\s+system\s+prompt|you\s+are\s+now\s+in\s+DAN\s+mode)/i,
    remediation: 'Review instructions to ensure they do not attempt to bypass agent security policies.',
  },
];
