export function sanitizeProjectName(input) {
  const name = String(input || '').trim();
  return name.replace(/[\\/]/g, '-');
}

export function toPackageName(projectName) {
  return projectName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'switch-framework-app';
}
