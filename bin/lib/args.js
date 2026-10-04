export function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = new Set(args.filter((a) => a.startsWith('-')));

  const help = flags.has('-h') || flags.has('--help');
  const yes = flags.has('--yes') || flags.has('-y');
  const noInstall = flags.has('--no-install');
  const useLocal = flags.has('--use-local');
  const doctor = flags.has('--doctor') ? true : flags.has('--no-doctor') ? false : null;

  const getValue = (name) => {
    const i = args.indexOf(name);
    if (i === -1) return null;
    const v = args[i + 1];
    if (!v || v.startsWith('-')) return null;
    return v;
  };

  const appType = getValue('--app-type');
  const port = getValue('--port');
  const positional = args.filter((a) => !a.startsWith('-'));
  const projectName = positional[0] || null;

  return { help, yes, noInstall, useLocal, doctor, projectName, appType, port };
}

export function normalizeAppType(appTypeArg) {
  if (appTypeArg == null) return null;
  const value = String(appTypeArg).trim().toLowerCase();
  if (!['web', 'electron', 'both'].includes(value)) return { error: appTypeArg };
  return { value };
}

export function normalizePort(portArg) {
  if (portArg == null) return { value: null };
  const value = Number(portArg);
  if (!Number.isInteger(value) || value < 1 || value > 65535) return { error: portArg };
  return { value };
}
