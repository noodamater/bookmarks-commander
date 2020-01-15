class PathView extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({
      mode: 'open'
    });
    shadow.innerHTML = `
      <style>
        div {
          display: flex;
          white-space: nowrap;
          overflow: auto;
        }
        label {
          background-color: #dadada;
          margin: 0 2px 2px 0;
          padding: 0 5px;
          cursor: pointer;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 24px; /* we need this to prevent special chars from resizing labels */
        }
        input:checked + label {
          min-width: fit-content;
          background-color: #fff;
        }
        input[type=radio] {
          display: none;
        }
      </style>
      <div id="content"></div>
    `;
    this.content = shadow.getElementById('content');
    this.content.addEventListener('click', e => {
      const {target} = e;
      if (target.id && target !== this.content) {
        this.dispatchEvent(new CustomEvent('submit', {
          detail: {
            entries: [{
              id: target.id,
              type: 'DIRECTORY'
            }]
          }
        }));
      }
    });
  }
  build(map) {
    this.content.textContent = '';
    const f = document.createDocumentFragment();
    map.forEach(({title, id}, i) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'group';
      input.id = id;
      input.checked = i === map.length - 1;
      f.appendChild(input);
      label.textContent = title || '';
      f.appendChild(label);
      label.setAttribute('for', input.id);
    });
    this.content.appendChild(f);
    this.content.scrollLeft = this.content.scrollWidth;
  }
}
window.customElements.define('path-view', PathView);
