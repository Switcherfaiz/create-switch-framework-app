export const screen = {
  name: 'explore',
  path: '/explore',
  title: 'Explore',
  tag: 'sw-explore-screen',
  layout: 'tabs'
};

export class SwExploreScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="wrap">
        <div class="h">Explore</div>
        <div class="p">This is a placeholder tab. Replace it with whatever you want.</div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host{display:block;padding:18px;font-family:var(--font)}
        *{box-sizing:border-box;font-family:inherit}
        .wrap{max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:10px}
        .h{font-weight:1000;font-size:22px;color:var(--main_text)}
        .p{color:var(--sub_text);font-weight:800;line-height:1.5}
      </style>
    `;
  }
}

if (!customElements.get('sw-explore-screen')) {
  customElements.define('sw-explore-screen', SwExploreScreen);
}
