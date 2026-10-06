import { SwitchComponent } from 'switch-framework';
import 'switch-framework-icons';

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
      ['switch-framework', versions.switchFramework, 'Components + state'],
      ['switch-framework-backend', versions.switchFrameworkBackend, 'Import map + /npm'],
      ['switch-framework-router', versions.switchFrameworkRouter, 'Layouts + navigate'],
      ['switch-framework-icons', versions.switchFrameworkIcons, '<sw-icon> + font'],
      ['switch-framework-electron', versions.switchFrameworkElectron, 'Desktop shell'],
      ['switch-framework-doctor', versions.switchFrameworkDoctor, 'Health check CLI'],
      ['create-switch-framework-app', versions.createSwitchFrameworkApp, 'This scaffold']
    ];

    return rows.map(([label, version, hint], i) => `
      <div class="row" style="--i:${i}">
        <div class="meta">
          <div class="l">${label}</div>
          <div class="h">${hint}</div>
        </div>
        <div class="r">${version ?? '—'}</div>
      </div>
    `).join('');
  }

  render() {
    return `
      <div class="wrap">
        <div class="head">
          <sw-icon name="compass" size="22"></sw-icon>
          <div>
            <h1>Installed stack</h1>
            <p>First-party packages on the 0.3.0 line. Electron and doctor show a dash when this app does not use them.</p>
          </div>
        </div>

        <div class="section">
          <div class="label">Packages</div>
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
        @import url('/switch-framework-icons/style.css');

        :host {
          display: block;
          padding: 24px 18px;
          font-family: var(--font, system-ui, sans-serif);
          background: var(--page_background);
        }

        * { box-sizing: border-box; font-family: inherit; }

        .wrap {
          max-width: 560px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .head {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          animation: rise 0.5s ease both;
        }

        .head sw-icon { color: var(--main_color, #4f46e5); margin-top: 4px; }

        h1 {
          margin: 0 0 6px;
          font-size: 22px;
          font-weight: 800;
          color: var(--main_text, #111);
        }

        .head p {
          margin: 0;
          color: var(--sub_text, #666);
          font-weight: 600;
          line-height: 1.45;
        }

        .label {
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 1.2px;
          color: var(--sub_text, #666);
          text-transform: uppercase;
          padding: 0 4px 8px;
        }

        .card {
          background: var(--surface_3, #f4f4f5);
          border-radius: 20px;
          padding: 8px;
          display: flex;
          flex-direction: column;
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          animation: rise 0.45s ease both;
          animation-delay: calc(0.05s * var(--i, 0));
        }

        .l { font-weight: 700; color: var(--main_text, #111); font-size: 13px; }
        .h { font-size: 12px; color: var(--sub_text, #666); font-weight: 600; margin-top: 2px; }
        .r {
          font-weight: 600;
          color: var(--sub_text, #666);
          background: rgba(0, 0, 0, 0.05);
          padding: 6px 12px;
          border-radius: 999px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 11px;
          white-space: nowrap;
        }

        .loading, .err {
          padding: 12px 14px;
          color: var(--sub_text, #666);
          font-weight: 600;
          font-size: 14px;
        }

        .err { color: #dc2626; }

        @keyframes rise {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
      </style>
    `;
  }
}
