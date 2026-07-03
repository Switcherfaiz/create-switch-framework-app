import { SwitchComponent } from 'switch-framework';

export class SwExploreScreen extends SwitchComponent {
  static screenName = 'explore';
  static path = '/explore';
  static title = 'Explore';
  static tag = 'sw-explore-screen';
  static layout = 'tabs';

  onMount() {
    this.loadVersions();
  }

  async loadVersions() {
    const container = this.select('#versions');
    if (!container) return;

    try {
      const res = await fetch('/api/versions');
      if (!res.ok) throw new Error('Failed to fetch versions');
      const versions = await res.json();
      container.innerHTML = this.renderVersionRows(versions);
    } catch {
      container.innerHTML = '<div class="err">Could not load package versions.</div>';
    }
  }

  renderVersionRows(versions) {
    const rows = [
      ['switch-framework', versions.switchFramework],
      ['switch-framework-backend', versions.switchFrameworkBackend],
      ['create-switch-framework-app', versions.createSwitchFrameworkApp]
    ];

    return rows.map(([label, version]) => `
      <div class="row">
        <div class="l">${label}</div>
        <div class="r">${version ?? '—'}</div>
      </div>
    `).join('');
  }

  render() {
    return `
      <div class="wrap">
        <div class="h">Explore</div>
        <div class="p">Installed Switch Framework package versions for this project.</div>

        <div class="section">
          <div class="label">PACKAGES</div>
          <div id="versions" class="card">
            <div class="loading">Loading versions…</div>
          </div>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          padding: 18px;
          font-family: var(--font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          background: var(--page_background);
        }

        * {
          box-sizing: border-box;
          font-family: inherit;
        }

        .wrap {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .h {
          font-weight: 1000;
          font-size: 22px;
          color: var(--main_text, #000);
        }

        .p {
          color: var(--sub_text, #666);
          font-weight: 600;
          line-height: 1.5;
        }

        .section {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .label {
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 1.2px;
          color: var(--sub_text, #666);
          text-transform: uppercase;
          padding: 0 4px;
        }

        .card {
          width: 100%;
          background: var(--surface_3);
          border-radius: 20px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        :root[data-theme="dark"] .card {
          background: rgba(255, 255, 255, 0.08);
        }

        .row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
        }

        :root[data-theme="dark"] .row {
          background: rgba(255, 255, 255, 0.06);
        }

        .l {
          font-weight: 600;
          color: var(--main_text, #000);
          font-size: 14px;
        }

        .r {
          font-weight: 500;
          color: var(--sub_text, #666);
          background: rgba(0, 0, 0, 0.05);
          padding: 6px 12px;
          border-radius: 999px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 11px;
          white-space: nowrap;
        }

        :root[data-theme="dark"] .r {
          background: rgba(255, 255, 255, 0.1);
        }

        .loading,
        .err {
          padding: 12px 14px;
          color: var(--sub_text, #666);
          font-weight: 600;
          font-size: 14px;
        }

        .err {
          color: #dc2626;
        }
      </style>
    `;
  }
}
