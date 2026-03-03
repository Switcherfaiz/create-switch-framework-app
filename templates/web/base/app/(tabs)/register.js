export async function appRegisters() {
  await Promise.all([
    import('../components/SwStarterSplashScreen.js'),
    import('../components/SwTabBar.js'),

    import('./index.js'),
    import('./+not-found.js'),
    import('./(tabs)/_layout.js'),
    import('./(tabs)/index.js'),
    import('./(tabs)/explore.js')
  ]);
}
