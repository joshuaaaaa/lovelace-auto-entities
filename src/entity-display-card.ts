import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  EntityDisplayConfig,
  ProcessedEntity,
  GroupedEntities,
  DEFAULT_ENTITY_TYPES,
  ValueRange,
  EntityTypeConfig,
} from './entity-display-types';
import './editor/entity-display-editor';

class EntityDisplayCard extends LitElement {
  @property() public hass: any;
  @state() private _config: EntityDisplayConfig;
  @state() private _entities: ProcessedEntity[] = [];
  @state() private _groupedEntities: GroupedEntities = {};

  static getConfigElement() {
    return document.createElement('entity-display-editor');
  }

  static getStubConfig(): EntityDisplayConfig {
    return {
      type: 'custom:entity-display-card',
      title: 'Senzory',
      layout: 'list',
      group_by: 'type',
      show_header: true,
      show_state: true,
      show_icon: true,
      show_name: true,
      show_unit: true,
      show_last_changed: false,
      show_graph: false,
      columns: 2,
      theme: 'default',
      entity_types: [],
    };
  }

  setConfig(config: EntityDisplayConfig) {
    if (!config) {
      throw new Error('Chybí konfigurace karty');
    }

    this._config = {
      ...EntityDisplayCard.getStubConfig(),
      ...config,
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  updated(changedProps: Map<string, any>) {
    super.updated(changedProps);
    if (changedProps.has('hass') || changedProps.has('_config')) {
      this._updateEntities();
    }
  }

  private _updateEntities() {
    if (!this.hass || !this._config) return;

    const entities: ProcessedEntity[] = [];

    // Získání entit ze konfigurace
    const entityIds = this._getEntityIds();

    for (const entityId of entityIds) {
      const stateObj = this.hass.states[entityId];
      if (!stateObj) continue;

      const processed = this._processEntity(entityId, stateObj);
      if (processed) {
        entities.push(processed);
      }
    }

    this._entities = entities;

    // Seskupení entit pokud je požadováno
    if (this._config.group_by && this._config.group_by !== 'none') {
      this._groupedEntities = this._groupEntities(entities);
    }
  }

  private _getEntityIds(): string[] {
    const entityIds: Set<string> = new Set();

    // Manuálně zadané entity
    if (this._config.entities) {
      this._config.entities.forEach((e) => entityIds.add(e));
    }

    // Entity z filtru
    if (this._config.filter && this.hass) {
      const allEntities = Object.keys(this.hass.states);

      for (const entityId of allEntities) {
        const stateObj = this.hass.states[entityId];

        // Include filtr
        if (this._config.filter.include) {
          for (const rule of this._config.filter.include) {
            if (this._matchesFilter(entityId, stateObj, rule)) {
              entityIds.add(entityId);
            }
          }
        }

        // Domain filtr
        if (this._config.filter.domain) {
          const domain = entityId.split('.')[0];
          if (this._config.filter.domain.includes(domain)) {
            entityIds.add(entityId);
          }
        }

        // Device class filtr
        if (this._config.filter.device_class) {
          const deviceClass = stateObj.attributes.device_class;
          if (deviceClass && this._config.filter.device_class.includes(deviceClass)) {
            entityIds.add(entityId);
          }
        }
      }

      // Exclude filtr
      if (this._config.filter.exclude) {
        for (const entityId of Array.from(entityIds)) {
          const stateObj = this.hass.states[entityId];
          for (const rule of this._config.filter.exclude) {
            if (this._matchesFilter(entityId, stateObj, rule)) {
              entityIds.delete(entityId);
            }
          }
        }
      }
    }

    return Array.from(entityIds);
  }

  private _matchesFilter(entityId: string, stateObj: any, rule: any): boolean {
    if (rule.domain) {
      const domain = entityId.split('.')[0];
      if (domain !== rule.domain) return false;
    }

    if (rule.device_class) {
      if (stateObj.attributes.device_class !== rule.device_class) return false;
    }

    if (rule.entity_id) {
      const pattern = new RegExp(rule.entity_id.replace(/\*/g, '.*'));
      if (!pattern.test(entityId)) return false;
    }

    if (rule.area) {
      // Implementace area filtru (vyžaduje registr entit)
      // Pro zjednodušení zatím přeskočeno
    }

    if (rule.state) {
      if (stateObj.state !== rule.state) return false;
    }

    if (rule.attributes) {
      for (const [key, value] of Object.entries(rule.attributes)) {
        if (stateObj.attributes[key] !== value) return false;
      }
    }

    return true;
  }

  private _processEntity(entityId: string, stateObj: any): ProcessedEntity | null {
    const deviceClass = stateObj.attributes.device_class || 'unknown';
    const domain = entityId.split('.')[0];

    // Získání konfigurace pro typ entity
    const typeConfig = this._getTypeConfig(deviceClass, domain);

    // Zpracování hodnoty
    let state: string | number = stateObj.state;
    const numericValue = parseFloat(String(state));
    if (!isNaN(numericValue) && isFinite(numericValue)) {
      state = numericValue;
      if (typeConfig.precision !== undefined) {
        state = parseFloat(numericValue.toFixed(typeConfig.precision));
      }
    }

    // Získání range konfigurace
    const range = this._getValueRange(state, typeConfig);

    // Zpracování jednotek
    let unit = stateObj.attributes.unit_of_measurement || typeConfig.unit || '';

    return {
      entity_id: entityId,
      name: stateObj.attributes.friendly_name || entityId,
      state,
      unit,
      icon: range?.icon || typeConfig.icon || this._getDefaultIcon(domain),
      color: range?.color || this._getDefaultColor(deviceClass),
      device_class: deviceClass,
      area: stateObj.attributes.area,
      floor: stateObj.attributes.floor,
      last_changed: new Date(stateObj.last_changed),
      attributes: stateObj.attributes,
      warning: range?.warning || false,
    };
  }

  private _getTypeConfig(deviceClass: string, domain: string): EntityTypeConfig {
    // Vlastní konfigurace z karty
    const customConfig = this._config.entity_types?.find(
      (t) => t.device_class === deviceClass
    );

    if (customConfig) {
      return customConfig;
    }

    // Defaultní konfigurace
    if (DEFAULT_ENTITY_TYPES[deviceClass]) {
      return DEFAULT_ENTITY_TYPES[deviceClass];
    }

    // Fallback
    return {
      device_class: deviceClass,
      icon: 'mdi:eye',
      precision: 1,
    };
  }

  private _getValueRange(state: string | number, config: EntityTypeConfig): ValueRange | null {
    if (!config.ranges || typeof state !== 'number') {
      return null;
    }

    for (const range of config.ranges) {
      const minMatch = range.min === undefined || state >= range.min;
      const maxMatch = range.max === undefined || state <= range.max;

      if (minMatch && maxMatch) {
        return range;
      }
    }

    return null;
  }

  private _getDefaultIcon(domain: string): string {
    const iconMap: Record<string, string> = {
      sensor: 'mdi:eye',
      binary_sensor: 'mdi:checkbox-marked-circle',
      light: 'mdi:lightbulb',
      switch: 'mdi:light-switch',
      climate: 'mdi:thermostat',
      fan: 'mdi:fan',
      cover: 'mdi:window-shutter',
      lock: 'mdi:lock',
      media_player: 'mdi:speaker',
      camera: 'mdi:camera',
    };

    return iconMap[domain] || 'mdi:eye';
  }

  private _getDefaultColor(deviceClass: string): string {
    return '#44739e'; // Defaultní modrá barva Home Assistant
  }

  private _groupEntities(entities: ProcessedEntity[]): GroupedEntities {
    const grouped: GroupedEntities = {};

    for (const entity of entities) {
      let key: string;

      switch (this._config.group_by) {
        case 'type':
          key = entity.device_class || 'Ostatní';
          break;
        case 'area':
          key = entity.area || 'Bez oblasti';
          break;
        case 'floor':
          key = entity.floor || 'Bez patra';
          break;
        default:
          key = 'Všechny';
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(entity);
    }

    // Seřazení skupin
    for (const key in grouped) {
      grouped[key] = this._sortEntities(grouped[key]);
    }

    return grouped;
  }

  private _sortEntities(entities: ProcessedEntity[]): ProcessedEntity[] {
    if (!this._config.sort_by) {
      return entities;
    }

    return entities.sort((a, b) => {
      switch (this._config.sort_by) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'state':
          if (typeof a.state === 'number' && typeof b.state === 'number') {
            return a.state - b.state;
          }
          return String(a.state).localeCompare(String(b.state));
        case 'last_changed':
          return b.last_changed.getTime() - a.last_changed.getTime();
        case 'area':
          return (a.area || '').localeCompare(b.area || '');
        default:
          return 0;
      }
    });
  }

  private _renderEntity(entity: ProcessedEntity) {
    const layout = this._config.layout || 'list';

    switch (layout) {
      case 'grid':
        return this._renderGridEntity(entity);
      case 'gauge':
        return this._renderGaugeEntity(entity);
      case 'compact':
        return this._renderCompactEntity(entity);
      case 'detailed':
        return this._renderDetailedEntity(entity);
      default:
        return this._renderListEntity(entity);
    }
  }

  private _renderListEntity(entity: ProcessedEntity) {
    return html`
      <div class="entity-row ${entity.warning ? 'warning' : ''}" @click=${() => this._handleEntityClick(entity)}>
        ${this._config.show_icon !== false
          ? html`<ha-icon class="entity-icon" .icon=${entity.icon} style="color: ${entity.color}"></ha-icon>`
          : ''}
        <div class="entity-info">
          ${this._config.show_name !== false
            ? html`<div class="entity-name">${entity.name}</div>`
            : ''}
          ${this._config.show_last_changed
            ? html`<div class="entity-secondary">${this._formatLastChanged(entity.last_changed)}</div>`
            : ''}
        </div>
        ${this._config.show_state !== false
          ? html`
              <div class="entity-state">
                <span class="state-value">${entity.state}</span>
                ${this._config.show_unit !== false && entity.unit
                  ? html`<span class="state-unit">${entity.unit}</span>`
                  : ''}
              </div>
            `
          : ''}
      </div>
    `;
  }

  private _renderGridEntity(entity: ProcessedEntity) {
    return html`
      <div class="grid-item ${entity.warning ? 'warning' : ''}" @click=${() => this._handleEntityClick(entity)}>
        <div class="grid-icon" style="background-color: ${entity.color}20; color: ${entity.color}">
          <ha-icon .icon=${entity.icon}></ha-icon>
        </div>
        <div class="grid-content">
          <div class="grid-name">${entity.name}</div>
          <div class="grid-state">
            <span class="state-value">${entity.state}</span>
            ${entity.unit ? html`<span class="state-unit">${entity.unit}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  private _renderGaugeEntity(entity: ProcessedEntity) {
    const typeConfig = this._getTypeConfig(entity.device_class || '', entity.entity_id.split('.')[0]);
    const percentage = this._calculatePercentage(entity.state, typeConfig);

    return html`
      <div class="gauge-item ${entity.warning ? 'warning' : ''}" @click=${() => this._handleEntityClick(entity)}>
        <div class="gauge-header">
          <ha-icon class="gauge-icon" .icon=${entity.icon}></ha-icon>
          <span class="gauge-name">${entity.name}</span>
        </div>
        <div class="gauge-bar-container">
          <div class="gauge-bar" style="width: ${percentage}%; background-color: ${entity.color}"></div>
        </div>
        <div class="gauge-value">
          ${entity.state}${entity.unit ? ` ${entity.unit}` : ''}
        </div>
      </div>
    `;
  }

  private _renderCompactEntity(entity: ProcessedEntity) {
    return html`
      <div class="compact-item ${entity.warning ? 'warning' : ''}" @click=${() => this._handleEntityClick(entity)}>
        <ha-icon .icon=${entity.icon} style="color: ${entity.color}"></ha-icon>
        <span class="compact-value">${entity.state}</span>
        ${entity.unit ? html`<span class="compact-unit">${entity.unit}</span>` : ''}
      </div>
    `;
  }

  private _renderDetailedEntity(entity: ProcessedEntity) {
    const typeConfig = this._getTypeConfig(entity.device_class || '', entity.entity_id.split('.')[0]);
    const range = this._getValueRange(entity.state, typeConfig);

    return html`
      <div class="detailed-item ${entity.warning ? 'warning' : ''}" @click=${() => this._handleEntityClick(entity)}>
        <div class="detailed-header">
          <div class="detailed-icon" style="background: ${entity.color}">
            <ha-icon .icon=${entity.icon}></ha-icon>
          </div>
          <div class="detailed-info">
            <div class="detailed-name">${entity.name}</div>
            <div class="detailed-meta">
              ${entity.area ? html`<span class="meta-area">${entity.area}</span>` : ''}
              ${range?.label ? html`<span class="meta-label">${range.label}</span>` : ''}
            </div>
          </div>
          <div class="detailed-state">
            <div class="state-value">${entity.state}</div>
            ${entity.unit ? html`<div class="state-unit">${entity.unit}</div>` : ''}
          </div>
        </div>
        ${this._config.show_graph && typeConfig.show_graph
          ? html`<div class="detailed-graph">
              <div class="graph-placeholder">Graf (historie 24h)</div>
            </div>`
          : ''}
        <div class="detailed-footer">
          <span>Naposledy změněno: ${this._formatLastChanged(entity.last_changed)}</span>
        </div>
      </div>
    `;
  }

  private _calculatePercentage(state: string | number, config: EntityTypeConfig): number {
    if (typeof state !== 'number' || !config.ranges) {
      return 50;
    }

    const ranges = config.ranges;
    const min = ranges[0]?.min ?? 0;
    const max = ranges[ranges.length - 1]?.max ?? 100;

    const percentage = ((state - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  private _formatLastChanged(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `před ${days}d`;
    if (hours > 0) return `před ${hours}h`;
    if (minutes > 0) return `před ${minutes}m`;
    return 'právě teď';
  }

  private _handleEntityClick(entity: ProcessedEntity) {
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId: entity.entity_id },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _getGroupTitle(key: string): string {
    // Překladové mapování pro device classes
    const translations: Record<string, string> = {
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
      signal_strength: 'Signál',
      unknown: 'Ostatní',
    };

    return translations[key] || key;
  }

  render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const entities = this._config.group_by && this._config.group_by !== 'none'
      ? this._groupedEntities
      : { Všechny: this._entities };

    const isEmpty = Object.keys(entities).length === 0 ||
                    Object.values(entities).every(group => group.length === 0);

    if (isEmpty) {
      return html`
        <ha-card>
          <div class="empty-state">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <p>Žádné entity k zobrazení</p>
          </div>
        </ha-card>
      `;
    }

    const layout = this._config.layout || 'list';
    const columns = this._config.columns || 2;

    return html`
      <ha-card>
        ${this._config.show_header !== false && this._config.title
          ? html`<div class="card-header">${this._config.title}</div>`
          : ''}
        <div class="card-content ${layout}-layout" style="--columns: ${columns}">
          ${Object.entries(entities).map(([groupKey, groupEntities]) => {
            if (groupEntities.length === 0) return '';

            return html`
              ${this._config.group_by && this._config.group_by !== 'none'
                ? html`<div class="group-header">${this._getGroupTitle(groupKey)}</div>`
                : ''}
              <div class="entities-container ${layout}-container">
                ${groupEntities.map((entity) => this._renderEntity(entity))}
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      padding: 16px;
    }

    .card-header {
      font-size: 24px;
      font-weight: 500;
      padding-bottom: 16px;
      color: var(--primary-text-color);
    }

    .card-content {
      padding: 0;
    }

    .group-header {
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 16px 0 8px 0;
      padding-bottom: 4px;
      border-bottom: 2px solid var(--divider-color);
    }

    .group-header:first-child {
      margin-top: 0;
    }

    /* List Layout */
    .list-container {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .entity-row {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color);
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .entity-row:hover {
      background-color: var(--secondary-background-color);
    }

    .entity-row:last-child {
      border-bottom: none;
    }

    .entity-row.warning {
      background-color: var(--error-color, #f44336)10;
    }

    .entity-icon {
      width: 40px;
      height: 40px;
      margin-right: 12px;
      --mdc-icon-size: 24px;
    }

    .entity-info {
      flex: 1;
      min-width: 0;
    }

    .entity-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .entity-secondary {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }

    .entity-state {
      display: flex;
      align-items: baseline;
      gap: 4px;
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
    }

    .state-unit {
      font-size: 12px;
      color: var(--secondary-text-color);
      font-weight: 400;
    }

    /* Grid Layout */
    .grid-container {
      display: grid;
      grid-template-columns: repeat(var(--columns, 2), 1fr);
      gap: 12px;
    }

    .grid-item {
      display: flex;
      flex-direction: column;
      padding: 16px;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .grid-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .grid-item.warning {
      border-color: var(--error-color, #f44336);
    }

    .grid-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      --mdc-icon-size: 28px;
    }

    .grid-content {
      flex: 1;
    }

    .grid-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .grid-state {
      font-size: 20px;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .grid-state .state-unit {
      font-size: 14px;
    }

    /* Gauge Layout */
    .gauge-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .gauge-item {
      padding: 12px;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .gauge-item:hover {
      background: var(--secondary-background-color);
    }

    .gauge-item.warning {
      border-color: var(--error-color, #f44336);
    }

    .gauge-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .gauge-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }

    .gauge-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .gauge-bar-container {
      height: 8px;
      background: var(--divider-color);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 4px;
    }

    .gauge-bar {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 4px;
    }

    .gauge-value {
      text-align: right;
      font-size: 12px;
      color: var(--secondary-text-color);
    }

    /* Compact Layout */
    .compact-container {
      display: grid;
      grid-template-columns: repeat(var(--columns, 3), 1fr);
      gap: 8px;
    }

    .compact-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s;
      font-size: 13px;
    }

    .compact-item:hover {
      background: var(--secondary-background-color);
    }

    .compact-item.warning {
      background: var(--error-color, #f44336)10;
    }

    .compact-item ha-icon {
      --mdc-icon-size: 18px;
    }

    .compact-value {
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .compact-unit {
      font-size: 11px;
      color: var(--secondary-text-color);
    }

    /* Detailed Layout */
    .detailed-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detailed-item {
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s;
    }

    .detailed-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .detailed-item.warning {
      border-color: var(--error-color, #f44336);
    }

    .detailed-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }

    .detailed-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      --mdc-icon-size: 32px;
    }

    .detailed-info {
      flex: 1;
      min-width: 0;
    }

    .detailed-name {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin-bottom: 4px;
    }

    .detailed-meta {
      display: flex;
      gap: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }

    .meta-area {
      padding: 2px 8px;
      background: var(--secondary-background-color);
      border-radius: 4px;
    }

    .meta-label {
      padding: 2px 8px;
      background: var(--primary-color)20;
      color: var(--primary-color);
      border-radius: 4px;
      font-weight: 500;
    }

    .detailed-state {
      text-align: right;
    }

    .detailed-state .state-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--primary-text-color);
      line-height: 1;
    }

    .detailed-state .state-unit {
      font-size: 14px;
      color: var(--secondary-text-color);
      font-weight: 400;
      margin-top: 2px;
    }

    .detailed-graph {
      padding: 0 16px 16px;
    }

    .graph-placeholder {
      height: 80px;
      background: var(--secondary-background-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      font-size: 12px;
    }

    .detailed-footer {
      padding: 12px 16px;
      background: var(--secondary-background-color);
      font-size: 12px;
      color: var(--secondary-text-color);
      border-top: 1px solid var(--divider-color);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 48px 16px;
      color: var(--secondary-text-color);
    }

    .empty-state ha-icon {
      --mdc-icon-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .grid-container {
        grid-template-columns: 1fr;
      }

      .compact-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;

  getCardSize() {
    const entityCount = this._entities.length;
    const layout = this._config.layout || 'list';

    switch (layout) {
      case 'compact':
        return Math.ceil(entityCount / (this._config.columns || 3)) + 1;
      case 'grid':
        return Math.ceil(entityCount / (this._config.columns || 2)) * 2 + 1;
      case 'detailed':
        return entityCount * 3 + 1;
      default:
        return entityCount + 1;
    }
  }
}

customElements.define('entity-display-card', EntityDisplayCard);

// Registrace karty v window pro Home Assistant
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'entity-display-card',
  name: 'Entity Display Card',
  description: 'Pokročilá karta pro zobrazení entit s filtry a vizualizacemi',
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    'entity-display-card': EntityDisplayCard;
  }
}
