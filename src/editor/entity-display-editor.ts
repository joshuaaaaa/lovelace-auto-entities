import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { EntityDisplayConfig, DEFAULT_ENTITY_TYPES } from '../entity-display-types';

class EntityDisplayEditor extends LitElement {
  @property() public hass: any;
  @state() private _config: EntityDisplayConfig;
  @state() private _selectedTab: number = 0;

  setConfig(config: EntityDisplayConfig) {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent) {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target as any;
    const configValue = target.configValue;
    const value = target.value || ev.detail.value;

    if (configValue) {
      const newConfig = { ...this._config };
      this._setConfigValue(newConfig, configValue, value);
      this._config = newConfig;

      const event = new CustomEvent('config-changed', {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    }
  }

  private _setConfigValue(config: any, path: string, value: any) {
    const keys = path.split('.');
    let current = config;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (value === '' || value === null || value === undefined) {
      delete current[lastKey];
    } else {
      current[lastKey] = value;
    }
  }

  private _addEntity() {
    const entities = this._config.entities || [];
    const newEntities = [...entities, ''];

    this._config = {
      ...this._config,
      entities: newEntities,
    };

    this._fireConfigChanged();
  }

  private _removeEntity(index: number) {
    const entities = this._config.entities || [];
    const newEntities = entities.filter((_, i) => i !== index);

    this._config = {
      ...this._config,
      entities: newEntities,
    };

    this._fireConfigChanged();
  }

  private _updateEntity(index: number, value: string) {
    const entities = this._config.entities || [];
    const newEntities = [...entities];
    newEntities[index] = value;

    this._config = {
      ...this._config,
      entities: newEntities,
    };

    this._fireConfigChanged();
  }

  private _addDeviceClass() {
    const filter = this._config.filter || {};
    const deviceClasses = filter.device_class || [];
    const newDeviceClasses = [...deviceClasses, ''];

    this._config = {
      ...this._config,
      filter: {
        ...filter,
        device_class: newDeviceClasses,
      },
    };

    this._fireConfigChanged();
  }

  private _removeDeviceClass(index: number) {
    const filter = this._config.filter || {};
    const deviceClasses = filter.device_class || [];
    const newDeviceClasses = deviceClasses.filter((_, i) => i !== index);

    this._config = {
      ...this._config,
      filter: {
        ...filter,
        device_class: newDeviceClasses,
      },
    };

    this._fireConfigChanged();
  }

  private _updateDeviceClass(index: number, value: string) {
    const filter = this._config.filter || {};
    const deviceClasses = filter.device_class || [];
    const newDeviceClasses = [...deviceClasses];
    newDeviceClasses[index] = value;

    this._config = {
      ...this._config,
      filter: {
        ...filter,
        device_class: newDeviceClasses,
      },
    };

    this._fireConfigChanged();
  }

  private _fireConfigChanged() {
    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _renderGeneralTab() {
    return html`
      <div class="editor-section">
        <div class="editor-row">
          <ha-textfield
            label="Název karty"
            .configValue=${'title'}
            .value=${this._config.title || ''}
            @change=${this._valueChanged}
          ></ha-textfield>
        </div>

        <div class="editor-row">
          <ha-select
            label="Rozložení"
            .configValue=${'layout'}
            .value=${this._config.layout || 'list'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="list">Seznam</mwc-list-item>
            <mwc-list-item value="grid">Mřížka</mwc-list-item>
            <mwc-list-item value="gauge">Ukazatel</mwc-list-item>
            <mwc-list-item value="compact">Kompaktní</mwc-list-item>
            <mwc-list-item value="detailed">Podrobné</mwc-list-item>
          </ha-select>
        </div>

        ${this._config.layout === 'grid' || this._config.layout === 'compact'
          ? html`
              <div class="editor-row">
                <ha-textfield
                  label="Počet sloupců"
                  type="number"
                  min="1"
                  max="6"
                  .configValue=${'columns'}
                  .value=${this._config.columns || 2}
                  @change=${this._valueChanged}
                ></ha-textfield>
              </div>
            `
          : ''}

        <div class="editor-row">
          <ha-select
            label="Seskupit podle"
            .configValue=${'group_by'}
            .value=${this._config.group_by || 'none'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="none">Neseskupovat</mwc-list-item>
            <mwc-list-item value="type">Typ</mwc-list-item>
            <mwc-list-item value="area">Oblast</mwc-list-item>
            <mwc-list-item value="floor">Patro</mwc-list-item>
          </ha-select>
        </div>

        <div class="editor-row">
          <ha-select
            label="Řadit podle"
            .configValue=${'sort_by'}
            .value=${this._config.sort_by || 'name'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="name">Název</mwc-list-item>
            <mwc-list-item value="state">Stav</mwc-list-item>
            <mwc-list-item value="last_changed">Poslední změna</mwc-list-item>
            <mwc-list-item value="area">Oblast</mwc-list-item>
          </ha-select>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="Obrátit pořadí (sestupně)">
            <ha-checkbox
              .checked=${this._config.sort_reverse === true}
              .configValue=${'sort_reverse'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>
      </div>

      <div class="editor-section">
        <div class="section-header">Grafy</div>
        <p class="section-description">
          Konfigurace grafů pro detailed layout
        </p>

        <div class="editor-row">
          <ha-select
            label="Typ grafu"
            .configValue=${'graph_type'}
            .value=${this._config.graph_type || 'line'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="line">Čára</mwc-list-item>
            <mwc-list-item value="area">Oblast</mwc-list-item>
            <mwc-list-item value="bar">Sloupcový</mwc-list-item>
          </ha-select>
        </div>

        <div class="editor-row">
          <ha-textfield
            label="Počet hodin historie"
            type="number"
            min="1"
            max="168"
            .configValue=${'graph_hours'}
            .value=${this._config.graph_hours || 24}
            @change=${this._valueChanged}
          ></ha-textfield>
        </div>

        <div class="editor-row">
          <ha-textfield
            label="Výška grafu (px)"
            type="number"
            min="50"
            max="300"
            .configValue=${'graph_height'}
            .value=${this._config.graph_height || 100}
            @change=${this._valueChanged}
          ></ha-textfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="Vyplnit oblast pod grafem">
            <ha-checkbox
              .checked=${this._config.graph_fill !== false}
              .configValue=${'graph_fill'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>
      </div>

      <div class="editor-section">
        <div class="section-header">Zobrazení</div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="Zobrazit hlavičku">
            <ha-checkbox
              .checked=${this._config.show_header !== false}
              .configValue=${'show_header'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="Zobrazit ikony">
            <ha-checkbox
              .checked=${this._config.show_icon !== false}
              .configValue=${'show_icon'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="Zobrazit názvy">
            <ha-checkbox
              .checked=${this._config.show_name !== false}
              .configValue=${'show_name'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="Zobrazit stavy">
            <ha-checkbox
              .checked=${this._config.show_state !== false}
              .configValue=${'show_state'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="Zobrazit jednotky">
            <ha-checkbox
              .checked=${this._config.show_unit !== false}
              .configValue=${'show_unit'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="Zobrazit poslední změnu">
            <ha-checkbox
              .checked=${this._config.show_last_changed === true}
              .configValue=${'show_last_changed'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="Zobrazit grafy (kde podporováno)">
            <ha-checkbox
              .checked=${this._config.show_graph === true}
              .configValue=${'show_graph'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>
      </div>
    `;
  }

  private _renderEntitiesTab() {
    const entities = this._config.entities || [];

    return html`
      <div class="editor-section">
        <div class="section-header">Manuální entity</div>
        <p class="section-description">
          Zadejte konkrétní entity, které chcete zobrazit
        </p>

        ${entities.map(
          (entity, index) => html`
            <div class="editor-row entity-row">
              <ha-entity-picker
                .hass=${this.hass}
                .value=${entity}
                @value-changed=${(ev: CustomEvent) =>
                  this._updateEntity(index, ev.detail.value)}
                allow-custom-entity
              ></ha-entity-picker>
              <ha-icon-button
                .path=${'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'}
                @click=${() => this._removeEntity(index)}
              ></ha-icon-button>
            </div>
          `
        )}

        <mwc-button @click=${this._addEntity}>
          <ha-icon icon="mdi:plus"></ha-icon>
          Přidat entitu
        </mwc-button>
      </div>
    `;
  }

  private _renderFiltersTab() {
    const deviceClasses = this._config.filter?.device_class || [];
    const domains = this._config.filter?.domain || [];

    return html`
      <div class="editor-section">
        <div class="section-header">Filtry</div>
        <p class="section-description">
          Automaticky vyberte entity podle kritérií
        </p>

        <div class="subsection-header">Device Class (typ senzoru)</div>
        ${deviceClasses.map(
          (deviceClass, index) => html`
            <div class="editor-row entity-row">
              <ha-select
                label="Device Class"
                .value=${deviceClass}
                @selected=${(ev: any) =>
                  this._updateDeviceClass(index, ev.target.value)}
                @closed=${(ev: Event) => ev.stopPropagation()}
              >
                ${Object.keys(DEFAULT_ENTITY_TYPES).map(
                  (key) => html`
                    <mwc-list-item value="${key}">
                      ${this._getDeviceClassLabel(key)}
                    </mwc-list-item>
                  `
                )}
              </ha-select>
              <ha-icon-button
                .path=${'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'}
                @click=${() => this._removeDeviceClass(index)}
              ></ha-icon-button>
            </div>
          `
        )}

        <mwc-button @click=${this._addDeviceClass}>
          <ha-icon icon="mdi:plus"></ha-icon>
          Přidat Device Class
        </mwc-button>
      </div>

      <div class="editor-section">
        <div class="info-box">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <div>
            <strong>Tip:</strong> Device Class určuje typ senzoru (teplota, vlhkost atd.).
            Pokud nevíte, jaký typ použít, podívejte se na atributy entity v Developer Tools.
          </div>
        </div>
      </div>
    `;
  }

  private _renderTypesTab() {
    return html`
      <div class="editor-section">
        <div class="section-header">Podporované typy entit</div>
        <p class="section-description">
          Karta automaticky rozpozná a správně zobrazí následující typy:
        </p>

        <div class="types-grid">
          ${Object.entries(DEFAULT_ENTITY_TYPES).map(
            ([key, config]) => html`
              <div class="type-card">
                <div class="type-header">
                  <ha-icon .icon=${config.icon}></ha-icon>
                  <span class="type-name">${this._getDeviceClassLabel(key)}</span>
                </div>
                <div class="type-info">
                  <span class="type-unit">${config.unit || 'N/A'}</span>
                  ${config.ranges
                    ? html`
                        <span class="type-ranges">${config.ranges.length} rozsahů</span>
                      `
                    : ''}
                </div>
                ${config.ranges
                  ? html`
                      <div class="type-ranges-list">
                        ${config.ranges.map(
                          (range) => html`
                            <div class="range-item">
                              <div class="range-color" style="background-color: ${range.color}"></div>
                              <span>${range.label || 'N/A'}</span>
                            </div>
                          `
                        )}
                      </div>
                    `
                  : ''}
              </div>
            `
          )}
        </div>
      </div>

      <div class="editor-section">
        <div class="info-box success">
          <ha-icon icon="mdi:check-circle"></ha-icon>
          <div>
            Všechny typy mají přednastavené <strong>barevné rozsahy</strong>,
            <strong>ikony</strong> a <strong>varovné hodnoty</strong> pro optimální zobrazení.
          </div>
        </div>
      </div>
    `;
  }

  private _renderExamplesTab() {
    return html`
      <div class="editor-section">
        <div class="section-header">Příklady použití</div>

        <div class="example-card">
          <div class="example-header">
            <ha-icon icon="mdi:thermometer"></ha-icon>
            <span>Všechny teplotní senzory</span>
          </div>
          <pre><code>type: custom:entity-display-card
title: "Teploty v domě"
layout: grid
columns: 2
filter:
  device_class:
    - temperature</code></pre>
        </div>

        <div class="example-card">
          <div class="example-header">
            <ha-icon icon="mdi:water-percent"></ha-icon>
            <span>Teplota a vlhkost</span>
          </div>
          <pre><code>type: custom:entity-display-card
title: "Klima v domě"
layout: detailed
group_by: area
show_graph: true
filter:
  device_class:
    - temperature
    - humidity</code></pre>
        </div>

        <div class="example-card">
          <div class="example-header">
            <ha-icon icon="mdi:battery"></ha-icon>
            <span>Slabé baterie</span>
          </div>
          <pre><code>type: custom:entity-display-card
title: "Baterie k výměně"
layout: list
filter:
  device_class:
    - battery
sort_by: state</code></pre>
        </div>

        <div class="example-card">
          <div class="example-header">
            <ha-icon icon="mdi:gauge"></ha-icon>
            <span>Všechny senzory (gauge)</span>
          </div>
          <pre><code>type: custom:entity-display-card
title: "Přehled senzorů"
layout: gauge
group_by: type
filter:
  device_class:
    - temperature
    - humidity
    - pressure
    - illuminance
    - battery</code></pre>
        </div>

        <div class="example-card">
          <div class="example-header">
            <ha-icon icon="mdi:grid"></ha-icon>
            <span>Kompaktní přehled</span>
          </div>
          <pre><code>type: custom:entity-display-card
title: "Quick View"
layout: compact
columns: 3
show_name: false
filter:
  device_class:
    - temperature
    - humidity
    - battery</code></pre>
        </div>
      </div>
    `;
  }

  private _getDeviceClassLabel(deviceClass: string): string {
    const labels: Record<string, string> = {
      temperature: 'Teplota',
      humidity: 'Vlhkost',
      battery: 'Baterie',
      pressure: 'Tlak',
      illuminance: 'Osvětlení',
      power: 'Výkon',
      energy: 'Energie',
      carbon_dioxide: 'CO₂',
      volatile_organic_compounds: 'VOC',
      pm25: 'PM2.5',
      signal_strength: 'Síla signálu',
    };

    return labels[deviceClass] || deviceClass;
  }

  render() {
    if (!this._config) {
      return html``;
    }

    return html`
      <div class="editor-container">
        <div class="tabs">
          <mwc-tab
            .active=${this._selectedTab === 0}
            @click=${() => (this._selectedTab = 0)}
          >
            Obecné
          </mwc-tab>
          <mwc-tab
            .active=${this._selectedTab === 1}
            @click=${() => (this._selectedTab = 1)}
          >
            Entity
          </mwc-tab>
          <mwc-tab
            .active=${this._selectedTab === 2}
            @click=${() => (this._selectedTab = 2)}
          >
            Filtry
          </mwc-tab>
          <mwc-tab
            .active=${this._selectedTab === 3}
            @click=${() => (this._selectedTab = 3)}
          >
            Typy
          </mwc-tab>
          <mwc-tab
            .active=${this._selectedTab === 4}
            @click=${() => (this._selectedTab = 4)}
          >
            Příklady
          </mwc-tab>
        </div>

        <div class="tab-content">
          ${this._selectedTab === 0
            ? this._renderGeneralTab()
            : this._selectedTab === 1
            ? this._renderEntitiesTab()
            : this._selectedTab === 2
            ? this._renderFiltersTab()
            : this._selectedTab === 3
            ? this._renderTypesTab()
            : this._renderExamplesTab()}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .editor-container {
      padding: 16px;
    }

    .tabs {
      display: flex;
      gap: 8px;
      border-bottom: 2px solid var(--divider-color);
      margin-bottom: 16px;
    }

    mwc-tab {
      cursor: pointer;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 500;
      color: var(--secondary-text-color);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
    }

    mwc-tab[active] {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    .tab-content {
      padding-top: 8px;
    }

    .editor-section {
      margin-bottom: 24px;
    }

    .section-header {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin-bottom: 8px;
    }

    .subsection-header {
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      margin: 16px 0 8px 0;
    }

    .section-description {
      font-size: 13px;
      color: var(--secondary-text-color);
      margin: 0 0 16px 0;
    }

    .editor-row {
      margin-bottom: 16px;
    }

    .editor-row ha-textfield,
    .editor-row ha-select {
      width: 100%;
    }

    .checkbox-row {
      display: flex;
      align-items: center;
    }

    .entity-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .entity-row ha-entity-picker,
    .entity-row ha-select {
      flex: 1;
    }

    .info-box {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: var(--secondary-background-color);
      border-left: 4px solid var(--primary-color);
      border-radius: 4px;
      font-size: 13px;
      color: var(--primary-text-color);
    }

    .info-box.success {
      border-left-color: var(--success-color, #4caf50);
    }

    .info-box ha-icon {
      --mdc-icon-size: 24px;
      color: var(--primary-color);
    }

    .info-box.success ha-icon {
      color: var(--success-color, #4caf50);
    }

    .types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .type-card {
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 12px;
    }

    .type-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .type-header ha-icon {
      --mdc-icon-size: 24px;
      color: var(--primary-color);
    }

    .type-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--primary-text-color);
    }

    .type-info {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-bottom: 8px;
    }

    .type-unit {
      font-weight: 500;
    }

    .type-ranges-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .range-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--secondary-text-color);
    }

    .range-color {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }

    .example-card {
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .example-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .example-header ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    pre {
      margin: 0;
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 4px;
      overflow-x: auto;
    }

    code {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: var(--primary-text-color);
    }

    mwc-button {
      --mdc-theme-primary: var(--primary-color);
    }
  `;
}

customElements.define('entity-display-editor', EntityDisplayEditor);

declare global {
  interface HTMLElementTagNameMap {
    'entity-display-editor': EntityDisplayEditor;
  }
}
