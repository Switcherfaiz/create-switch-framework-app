import fs from 'fs-extra';
import path from 'node:path';

function lineFromVersion(version) {
  const match = String(version || '').match(/^(\d+)\.(\d+)/);
  if (!match) return '0.3.0';
  return `${match[1]}.${match[2]}.0`;
}

function nodeMajor(nodeVersion) {
  const match = String(nodeVersion || '').match(/^(\d+)/);
  return match ? Number(match[1]) : 18;
}

function electronRangeForNode(major) {
  if (major >= 22) return '^35.0.0';
  if (major >= 20) return '^34.0.0';
  return '^33.0.0';
}

export function getCliVersion(cliRoot) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cliRoot, 'package.json'), 'utf8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export function resolveVersions({
  cliVersion,
  nodeVersion = process.versions.node,
  appType = 'web'
} = {}) {
  const line = lineFromVersion(cliVersion);
  const range = `^${line}`;
  const major = nodeMajor(nodeVersion);

  return {
    cliVersion,
    nodeVersion,
    appType,
    line,
    framework: range,
    backend: range,
    electronFramework: range,
    doctor: range,
    dotenv: '^16.4.5',
    electron: electronRangeForNode(major),
    electronBuilder: '^25.1.8'
  };
}
