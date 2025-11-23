import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { EntityDisplayConfig, DEFAULT_ENTITY_TYPES } from '../entity-display-types';
import { localize, getLanguage } from '../localize';

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
    const lang = getLanguage(this.hass);

    return html`
      <div class="editor-section">
        <div class="editor-row">
          <ha-textfield
            label="${localize('editor_title', lang)}"
            .configValue=${'title'}
            .value=${this._config.title || ''}
            @change=${this._valueChanged}
          ></ha-textfield>
        </div>

        <div class="editor-row">
          <ha-select
            label="${localize('editor_layout', lang)}"
            .configValue=${'layout'}
            .value=${this._config.layout || 'list'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="list">${localize('layout_list', lang)}</mwc-list-item>
            <mwc-list-item value="grid">${localize('layout_grid', lang)}</mwc-list-item>
            <mwc-list-item value="gauge">${localize('layout_gauge', lang)}</mwc-list-item>
            <mwc-list-item value="compact">${localize('layout_compact', lang)}</mwc-list-item>
            <mwc-list-item value="detailed">${localize('layout_detailed', lang)}</mwc-list-item>
          </ha-select>
        </div>

        ${this._config.layout === 'grid' || this._config.layout === 'compact'
          ? html`
              <div class="editor-row">
                <ha-textfield
                  label="${localize('editor_columns', lang)}"
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
            label="${localize('editor_group_by', lang)}"
            .configValue=${'group_by'}
            .value=${this._config.group_by || 'none'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="none">${localize('group_none', lang)}</mwc-list-item>
            <mwc-list-item value="type">${localize('group_type', lang)}</mwc-list-item>
            <mwc-list-item value="area">${localize('group_area', lang)}</mwc-list-item>
            <mwc-list-item value="floor">${localize('group_floor', lang)}</mwc-list-item>
          </ha-select>
        </div>

        <div class="editor-row">
          <ha-select
            label="${localize('editor_sort_by', lang)}"
            .configValue=${'sort_by'}
            .value=${this._config.sort_by || 'name'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="name">${localize('sort_name', lang)}</mwc-list-item>
            <mwc-list-item value="state">${localize('sort_state', lang)}</mwc-list-item>
            <mwc-list-item value="last_changed">${localize('sort_last_changed', lang)}</mwc-list-item>
            <mwc-list-item value="area">${localize('sort_area', lang)}</mwc-list-item>
          </ha-select>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="${localize('editor_sort_reverse', lang)}">
            <ha-checkbox
              .checked=${this._config.sort_reverse === true}
              .configValue=${'sort_reverse'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="${localize('editor_ignore_invalid', lang)}">
            <ha-checkbox
              .checked=${this._config.ignore_invalid === true}
              .configValue=${'ignore_invalid'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>
      </div>

      <div class="editor-section">
        <div class="section-header">${localize('editor_section_graphs', lang)}</div>
        <p class="section-description">
          ${localize('editor_section_graphs_desc', lang)}
        </p>

        <div class="editor-row">
          <ha-select
            label="${localize('editor_graph_type', lang)}"
            .configValue=${'graph_type'}
            .value=${this._config.graph_type || 'line'}
            @selected=${this._valueChanged}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="line">${localize('graph_line', lang)}</mwc-list-item>
            <mwc-list-item value="area">${localize('graph_area', lang)}</mwc-list-item>
            <mwc-list-item value="bar">${localize('graph_bar', lang)}</mwc-list-item>
          </ha-select>
        </div>

        <div class="editor-row">
          <ha-textfield
            label="${localize('editor_graph_hours', lang)}"
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
            label="${localize('editor_graph_height', lang)}"
            type="number"
            min="50"
            max="300"
            .configValue=${'graph_height'}
            .value=${this._config.graph_height || 100}
            @change=${this._valueChanged}
          ></ha-textfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="${localize('editor_graph_fill', lang)}">
            <ha-checkbox
              .checked=${this._config.graph_fill !== false}
              .configValue=${'graph_fill'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>
      </div>

      <div class="editor-section">
        <div class="section-header">${localize('editor_section_display', lang)}</div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="${localize('editor_show_header', lang)}">
            <ha-checkbox
              .checked=${this._config.show_header !== false}
              .configValue=${'show_header'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="${localize('editor_show_icon', lang)}">
            <ha-checkbox
              .checked=${this._config.show_icon !== false}
              .configValue=${'show_icon'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="${localize('editor_show_name', lang)}">
            <ha-checkbox
              .checked=${this._config.show_name !== false}
              .configValue=${'show_name'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="${localize('editor_show_state', lang)}">
            <ha-checkbox
              .checked=${this._config.show_state !== false}
              .configValue=${'show_state'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="${localize('editor_show_unit', lang)}">
            <ha-checkbox
              .checked=${this._config.show_unit !== false}
              .configValue=${'show_unit'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="${localize('editor_show_last_changed', lang)}">
            <ha-checkbox
              .checked=${this._config.show_last_changed === true}
              .configValue=${'show_last_changed'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>

        <div class="editor-row checkbox-row">
          <ha-formfield label="${localize('editor_show_graph', lang)}">
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
    const lang = getLanguage(this.hass);

    return html`
      <div class="editor-section">
        <div class="section-header">${localize('editor_manual_entities', lang)}</div>
        <p class="section-description">
          ${localize('editor_manual_entities_desc', lang)}
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
          ${localize('editor_add_entity', lang)}
        </mwc-button>
      </div>
    `;
  }

  private _renderFiltersTab() {
    const deviceClasses = this._config.filter?.device_class || [];
    const domains = this._config.filter?.domain || [];
    const lang = getLanguage(this.hass);

    return html`
      <div class="editor-section">
        <div class="section-header">${localize('editor_filters', lang)}</div>
        <p class="section-description">
          ${localize('editor_filters_desc', lang)}
        </p>

        <div class="subsection-header">${localize('editor_device_class_label', lang)}</div>
        ${deviceClasses.map(
          (deviceClass, index) => html`
            <div class="editor-row entity-row">
              <ha-select
                label="${localize('editor_device_class_label', lang)}"
                .value=${deviceClass}
                @selected=${(ev: any) =>
                  this._updateDeviceClass(index, ev.target.value)}
                @closed=${(ev: Event) => ev.stopPropagation()}
              >
                ${Object.keys(DEFAULT_ENTITY_TYPES).map(
                  (key) => html`
                    <mwc-list-item value="${key}">
                      ${this._getDeviceClassLabel(key, lang)}
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
          ${localize('editor_add_device_class', lang)}
        </mwc-button>
      </div>

      <div class="editor-section">
        <div class="info-box">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <div>
            <strong>${localize('editor_info_tip', lang)}:</strong> ${lang === 'cs'
              ? 'Device Class určuje typ senzoru (teplota, vlhkost atd.). Pokud nevíte, jaký typ použít, podívejte se na atributy entity v Developer Tools.'
              : 'Device Class determines the sensor type (temperature, humidity, etc.). If you\'re unsure which type to use, check the entity attributes in Developer Tools.'}
          </div>
        </div>
      </div>
    `;
  }

  private _renderTypesTab() {
    const lang = getLanguage(this.hass);

    return html`
      <div class="editor-section">
        <div class="section-header">${localize('editor_supported_types', lang)}</div>
        <p class="section-description">
          ${localize('editor_supported_types_desc', lang)}
        </p>

        <div class="types-grid">
          ${Object.entries(DEFAULT_ENTITY_TYPES).map(
            ([key, config]) => html`
              <div class="type-card">
                <div class="type-header">
                  <ha-icon .icon=${config.icon}></ha-icon>
                  <span class="type-name">${this._getDeviceClassLabel(key, lang)}</span>
                </div>
                <div class="type-info">
                  <span class="type-unit">${config.unit || 'N/A'}</span>
                  ${config.ranges
                    ? html`
                        <span class="type-ranges">${config.ranges.length} ${lang === 'cs' ? 'rozsahů' : 'ranges'}</span>
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
            ${lang === 'cs'
              ? html`Všechny typy mají přednastavené <strong>barevné rozsahy</strong>, <strong>ikony</strong> a <strong>varovné hodnoty</strong> pro optimální zobrazení.`
              : html`All types have predefined <strong>color ranges</strong>, <strong>icons</strong>, and <strong>warning values</strong> for optimal display.`}
          </div>
        </div>
      </div>
    `;
  }

  private _renderExamplesTab() {
    const lang = getLanguage(this.hass);

    const examples = lang === 'cs' ? [
      {
        icon: 'mdi:thermometer',
        title: 'Všechny teplotní senzory',
        code: `type: custom:entity-display-card
title: "Teploty v domě"
layout: grid
columns: 2
filter:
  device_class:
    - temperature`
      },
      {
        icon: 'mdi:water-percent',
        title: 'Teplota a vlhkost',
        code: `type: custom:entity-display-card
title: "Klima v domě"
layout: detailed
group_by: area
show_graph: true
filter:
  device_class:
    - temperature
    - humidity`
      },
      {
        icon: 'mdi:battery',
        title: 'Slabé baterie',
        code: `type: custom:entity-display-card
title: "Baterie k výměně"
layout: list
filter:
  device_class:
    - battery
sort_by: state`
      },
      {
        icon: 'mdi:gauge',
        title: 'Všechny senzory (gauge)',
        code: `type: custom:entity-display-card
title: "Přehled senzorů"
layout: gauge
group_by: type
filter:
  device_class:
    - temperature
    - humidity
    - pressure
    - illuminance
    - battery`
      },
      {
        icon: 'mdi:grid',
        title: 'Kompaktní přehled',
        code: `type: custom:entity-display-card
title: "Quick View"
layout: compact
columns: 3
show_name: false
filter:
  device_class:
    - temperature
    - humidity
    - battery`
      }
    ] : [
      {
        icon: 'mdi:thermometer',
        title: 'All temperature sensors',
        code: `type: custom:entity-display-card
title: "Temperature Sensors"
layout: grid
columns: 2
filter:
  device_class:
    - temperature`
      },
      {
        icon: 'mdi:water-percent',
        title: 'Temperature and humidity',
        code: `type: custom:entity-display-card
title: "Climate Overview"
layout: detailed
group_by: area
show_graph: true
filter:
  device_class:
    - temperature
    - humidity`
      },
      {
        icon: 'mdi:battery',
        title: 'Low batteries',
        code: `type: custom:entity-display-card
title: "Batteries to Replace"
layout: list
filter:
  device_class:
    - battery
sort_by: state`
      },
      {
        icon: 'mdi:gauge',
        title: 'All sensors (gauge)',
        code: `type: custom:entity-display-card
title: "Sensors Overview"
layout: gauge
group_by: type
filter:
  device_class:
    - temperature
    - humidity
    - pressure
    - illuminance
    - battery`
      },
      {
        icon: 'mdi:grid',
        title: 'Compact overview',
        code: `type: custom:entity-display-card
title: "Quick View"
layout: compact
columns: 3
show_name: false
filter:
  device_class:
    - temperature
    - humidity
    - battery`
      }
    ];

    return html`
      <div class="editor-section">
        <div class="section-header">${lang === 'cs' ? 'Příklady použití' : 'Usage Examples'}</div>

        ${examples.map(example => html`
          <div class="example-card">
            <div class="example-header">
              <ha-icon icon="${example.icon}"></ha-icon>
              <span>${example.title}</span>
            </div>
            <pre><code>${example.code}</code></pre>
          </div>
        `)}
      </div>
    `;
  }

  private _getDeviceClassLabel(deviceClass: string, language?: string): string {
    const lang = language || getLanguage(this.hass);

    const mapping: Record<string, string> = {
      temperature: 'device_temperature',
      humidity: 'device_humidity',
      battery: 'device_battery',
      pressure: 'device_pressure',
      illuminance: 'device_illuminance',
      power: 'device_power',
      energy: 'device_energy',
      carbon_dioxide: 'device_carbon_dioxide',
      volatile_organic_compounds: 'device_volatile_organic_compounds',
      pm25: 'device_pm25',
      signal_strength: 'device_signal_strength',
    };

    const key = mapping[deviceClass];
    return key ? localize(key as any, lang) : deviceClass;
  }

  render() {
    if (!this._config) {
      return html``;
    }

    const lang = getLanguage(this.hass);

    return html`
      <div class="editor-container">
        <div class="tabs">
          <mwc-tab
            .active=${this._selectedTab === 0}
            @click=${() => (this._selectedTab = 0)}
          >
            ${localize('editor_tab_general', lang)}
          </mwc-tab>
          <mwc-tab
            .active=${this._selectedTab === 1}
            @click=${() => (this._selectedTab = 1)}
          >
            ${localize('editor_tab_entities', lang)}
          </mwc-tab>
          <mwc-tab
            .active=${this._selectedTab === 2}
            @click=${() => (this._selectedTab = 2)}
          >
            ${localize('editor_tab_filters', lang)}
          </mwc-tab>
          <mwc-tab
            .active=${this._selectedTab === 3}
            @click=${() => (this._selectedTab = 3)}
          >
            ${localize('editor_tab_types', lang)}
          </mwc-tab>
          <mwc-tab
            .active=${this._selectedTab === 4}
            @click=${() => (this._selectedTab = 4)}
          >
            ${localize('editor_tab_examples', lang)}
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
