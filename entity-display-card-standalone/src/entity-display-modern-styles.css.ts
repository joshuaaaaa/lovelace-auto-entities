import { css } from 'lit';

export const modernStyles = css`
  /* ===== CLEAN MINIMAL DESIGN ===== */
  :host {
    display: block;
    --transition-fast: 0.15s ease;
    --transition-base: 0.25s ease;
    --border-radius-sm: 6px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
  }

  * {
    box-sizing: border-box;
  }

  /* ===== CARD BASE ===== */
  ha-card {
    padding: 16px;
    background: var(--card-background-color);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
  }

  .card-header {
    font-size: 20px;
    font-weight: 600;
    padding-bottom: 16px;
    color: var(--primary-text-color);
  }

  .card-content {
    padding: 0;
  }

  .group-header {
    font-size: 12px;
    font-weight: 600;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 16px 0 8px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--divider-color);
  }

  .group-header:first-child {
    margin-top: 0;
  }

  /* ===== LIST LAYOUT ===== */
  .list-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .entity-row {
    display: flex;
    align-items: center;
    padding: 12px;
    background: var(--card-background-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .entity-row:hover {
    background: var(--secondary-background-color);
    border-color: var(--primary-color);
  }

  .entity-row.warning {
    border-color: var(--error-color, #f44336);
    background: rgba(244, 67, 54, 0.05);
  }

  .entity-icon {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    --mdc-icon-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--secondary-background-color);
    border-radius: 50%;
    flex-shrink: 0;
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
    font-weight: 600;
    color: var(--primary-text-color);
    white-space: nowrap;
  }

  .state-unit {
    font-size: 12px;
    color: var(--secondary-text-color);
    font-weight: 400;
  }

  /* ===== GRID LAYOUT ===== */
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
    border-radius: var(--border-radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .grid-item:hover {
    background: var(--secondary-background-color);
    border-color: var(--primary-color);
  }

  .grid-item.warning {
    border-color: var(--error-color, #f44336);
    background: rgba(244, 67, 54, 0.05);
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
    background: var(--secondary-background-color);
  }

  .grid-content {
    flex: 1;
  }

  .grid-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--primary-text-color);
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .grid-state {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .grid-state .state-unit {
    font-size: 13px;
  }

  /* ===== GAUGE LAYOUT ===== */
  .gauge-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .gauge-item {
    padding: 12px;
    background: var(--card-background-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .gauge-item:hover {
    background: var(--secondary-background-color);
    border-color: var(--primary-color);
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
    font-size: 13px;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .gauge-bar-container {
    height: 8px;
    background: var(--divider-color);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 6px;
  }

  .gauge-bar {
    height: 100%;
    border-radius: 4px;
    transition: width var(--transition-base);
  }

  .gauge-value {
    text-align: right;
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }

  /* ===== COMPACT LAYOUT ===== */
  .compact-container {
    display: grid;
    grid-template-columns: repeat(var(--columns, 3), 1fr);
    gap: 8px;
  }

  .compact-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px;
    background: var(--card-background-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 13px;
  }

  .compact-item:hover {
    background: var(--secondary-background-color);
    border-color: var(--primary-color);
  }

  .compact-item.warning {
    border-color: var(--error-color, #f44336);
    background: rgba(244, 67, 54, 0.05);
  }

  .compact-item ha-icon {
    --mdc-icon-size: 18px;
    flex-shrink: 0;
  }

  .compact-value {
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .compact-unit {
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  /* ===== DETAILED LAYOUT ===== */
  .detailed-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .detailed-item {
    background: var(--card-background-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .detailed-item:hover {
    background: var(--secondary-background-color);
    border-color: var(--primary-color);
  }

  .detailed-item.warning {
    border-color: var(--error-color, #f44336);
    background: rgba(244, 67, 54, 0.05);
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
    flex-shrink: 0;
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
    flex-wrap: wrap;
  }

  .meta-area {
    padding: 2px 8px;
    background: var(--secondary-background-color);
    border-radius: 10px;
    font-weight: 500;
  }

  .meta-label {
    padding: 2px 8px;
    background: var(--primary-color);
    color: white;
    border-radius: 10px;
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
    font-weight: 500;
    margin-top: 2px;
  }

  .detailed-graph {
    padding: 0 16px 12px;
  }

  .detailed-graph svg {
    width: 100%;
    height: auto;
  }

  .detailed-footer {
    padding: 12px 16px;
    background: var(--secondary-background-color);
    font-size: 12px;
    color: var(--secondary-text-color);
    border-top: 1px solid var(--divider-color);
  }

  /* ===== EMPTY STATE ===== */
  .empty-state {
    text-align: center;
    padding: 48px 16px;
    color: var(--secondary-text-color);
  }

  .empty-state ha-icon {
    --mdc-icon-size: 48px;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  .empty-state p {
    margin: 0;
    font-size: 14px;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 600px) {
    ha-card {
      padding: 12px;
    }

    .grid-container {
      grid-template-columns: 1fr;
    }

    .compact-container {
      grid-template-columns: repeat(2, 1fr);
    }

    .detailed-header {
      padding: 12px;
      gap: 12px;
    }

    .detailed-icon {
      width: 48px;
      height: 48px;
      --mdc-icon-size: 28px;
    }

    .detailed-name {
      font-size: 14px;
    }

    .detailed-state .state-value {
      font-size: 24px;
    }

    .card-header {
      font-size: 18px;
    }
  }

  /* ===== ACCESSIBILITY ===== */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
