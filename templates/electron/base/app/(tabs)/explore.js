import { SwitchComponent } from '/switch-framework/index.js';

export class SwExploreScreen extends SwitchComponent {
  static screenName = 'explore';
  static path = '/explore';
  static title = 'Explore';
  static tag = 'sw-explore-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="wrap">
        <div class="h">Explore</div>
        <div class="p">This is a placeholder tab. Replace it with whatever you want.</div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; padding: 18px; font-family: var(--font); }
        * { box-sizing: border-box; font-family: inherit; }
        .wrap { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
        .h { font-weight: 1000; font-size: 22px; color: var(--main_text); }
        .p { color: var(--sub_text); font-weight: 800; line-height: 1.5; }
      </style>
    `;
  }
}
