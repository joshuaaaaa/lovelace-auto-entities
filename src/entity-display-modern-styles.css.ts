import { css } from 'lit';

export const modernStyles = css`
  /* ===== BASE & MODERN RESET ===== */
  :host {
    display: block;
    --glass-blur: 20px;
    --glass-opacity: 0.7;
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
    --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
    --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16);
    --shadow-glow: 0 0 20px rgba(var(--primary-color-rgb, 68, 115, 158), 0.3);
    --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    --border-radius-sm: 8px;
    --border-radius-md: 12px;
    --border-radius-lg: 16px;
    --border-radius-xl: 20px;
  }

  * {
    box-sizing: border-box;
  }

  /* ===== CARD BASE ===== */
  ha-card {
    padding: 20px;
    background: var(--card-background-color);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    position: relative;
    transition: all var(--transition-base);
  }

  ha-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      var(--primary-color, #44739e),
      var(--accent-color, #ff9800)
    );
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  ha-card:hover::before {
    opacity: 1;
  }

  ha-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }

  .card-header {
    font-size: 28px;
    font-weight: 700;
    padding-bottom: 20px;
    color: var(--primary-text-color);
    letter-spacing: -0.5px;
    background: linear-gradient(
      135deg,
      var(--primary-text-color),
      var(--primary-color, #44739e)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-content {
    padding: 0;
  }

  .group-header {
    font-size: 13px;
    font-weight: 700;
    color: var(--primary-color, #44739e);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    margin: 20px 0 12px 0;
    padding: 8px 12px;
    background: linear-gradient(
      135deg,
      var(--primary-color, #44739e)15,
      transparent
    );
    border-left: 3px solid var(--primary-color, #44739e);
    border-radius: var(--border-radius-sm);
    position: relative;
    overflow: hidden;
  }

  .group-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, var(--primary-color, #44739e)10, transparent);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .group-header:first-child {
    margin-top: 0;
  }

  /* ===== LIST LAYOUT - MODERN ===== */
  .list-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .entity-row {
    display: flex;
    align-items: center;
    padding: 16px;
    background: var(--card-background-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all var(--transition-base);
  }

  .entity-row::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      var(--primary-color, #44739e)05,
      transparent
    );
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .entity-row:hover {
    border-color: var(--primary-color, #44739e);
    box-shadow: var(--shadow-md), var(--shadow-glow);
    transform: translateX(4px);
  }

  .entity-row:hover::before {
    opacity: 1;
  }

  .entity-row.warning {
    background: linear-gradient(
      135deg,
      var(--error-color, #f44336)08,
      transparent
    );
    border-color: var(--error-color, #f44336);
    animation: pulse-warning 2s infinite;
  }

  @keyframes pulse-warning {
    0%, 100% {
      box-shadow: 0 0 0 0 var(--error-color, #f44336)40;
    }
    50% {
      box-shadow: 0 0 0 8px var(--error-color, #f44336)00;
    }
  }

  .entity-icon {
    width: 48px;
    height: 48px;
    margin-right: 16px;
    --mdc-icon-size: 28px;
    background: var(--secondary-background-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-base);
    position: relative;
  }

  .entity-icon::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0;
    filter: blur(8px);
    transition: opacity var(--transition-base);
  }

  .entity-row:hover .entity-icon::after {
    opacity: 0.2;
  }

  .entity-row:hover .entity-icon {
    transform: scale(1.1) rotate(5deg);
  }

  .entity-info {
    flex: 1;
    min-width: 0;
  }

  .entity-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 2px;
  }

  .entity-secondary {
    font-size: 12px;
    color: var(--secondary-text-color);
    opacity: 0.8;
  }

  .entity-state {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-text-color);
    white-space: nowrap;
    padding: 8px 16px;
    background: var(--secondary-background-color);
    border-radius: var(--border-radius-sm);
  }

  .state-unit {
    font-size: 13px;
    color: var(--secondary-text-color);
    font-weight: 500;
    opacity: 0.7;
  }

  /* ===== GRID LAYOUT - GLASS MORPHISM ===== */
  .grid-container {
    display: grid;
    grid-template-columns: repeat(var(--columns, 2), 1fr);
    gap: 16px;
  }

  .grid-item {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background: linear-gradient(
      135deg,
      var(--card-background-color),
      var(--secondary-background-color)
    );
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--divider-color);
    border-radius: var(--border-radius-lg);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all var(--transition-base);
  }

  .grid-item::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at top right,
      var(--primary-color, #44739e)15,
      transparent 70%
    );
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .grid-item:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: var(--shadow-lg), var(--shadow-glow);
    border-color: var(--primary-color, #44739e);
  }

  .grid-item:hover::before {
    opacity: 1;
  }

  .grid-item.warning {
    border-color: var(--error-color, #f44336);
    animation: shake 0.5s;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }

  .grid-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    --mdc-icon-size: 32px;
    position: relative;
    transition: all var(--transition-slow);
  }

  .grid-icon::before {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.1;
    filter: blur(12px);
  }

  .grid-item:hover .grid-icon {
    transform: scale(1.15) rotate(360deg);
  }

  .grid-content {
    flex: 1;
    position: relative;
    z-index: 1;
  }

  .grid-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-text-color);
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .grid-state {
    font-size: 24px;
    font-weight: 800;
    color: var(--primary-text-color);
    letter-spacing: -0.5px;
  }

  .grid-state .state-unit {
    font-size: 15px;
  }

  /* ===== GAUGE LAYOUT - GRADIENT PROGRESS ===== */
  .gauge-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .gauge-item {
    padding: 16px;
    background: var(--card-background-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
  }

  .gauge-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      transparent,
      var(--primary-color, #44739e)05
    );
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .gauge-item:hover {
    border-color: var(--primary-color, #44739e);
    box-shadow: var(--shadow-md);
  }

  .gauge-item:hover::before {
    opacity: 1;
  }

  .gauge-item.warning {
    border-color: var(--error-color, #f44336);
  }

  .gauge-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
  }

  .gauge-icon {
    --mdc-icon-size: 22px;
    color: var(--primary-color, #44739e);
    transition: transform var(--transition-base);
  }

  .gauge-item:hover .gauge-icon {
    transform: scale(1.2);
  }

  .gauge-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .gauge-bar-container {
    height: 10px;
    background: var(--divider-color);
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 8px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .gauge-bar {
    height: 100%;
    border-radius: 5px;
    position: relative;
    transition: width var(--transition-slow);
    background: linear-gradient(
      90deg,
      var(--primary-color, #44739e),
      var(--accent-color, #ff9800)
    );
  }

  .gauge-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: slide 2s infinite;
  }

  @keyframes slide {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .gauge-value {
    text-align: right;
    font-size: 13px;
    font-weight: 600;
    color: var(--secondary-text-color);
    position: relative;
    z-index: 1;
  }

  /* ===== COMPACT LAYOUT - MINIMAL ===== */
  .compact-container {
    display: grid;
    grid-template-columns: repeat(var(--columns, 3), 1fr);
    gap: 10px;
  }

  .compact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: var(--card-background-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: all var(--transition-base);
    font-size: 14px;
    position: relative;
    overflow: hidden;
  }

  .compact-item::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--primary-color, #44739e)10, transparent);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .compact-item:hover {
    border-color: var(--primary-color, #44739e);
    box-shadow: var(--shadow-sm);
    transform: scale(1.05);
  }

  .compact-item:hover::before {
    opacity: 1;
  }

  .compact-item.warning {
    background: linear-gradient(135deg, var(--error-color, #f44336)10, transparent);
    border-color: var(--error-color, #f44336);
  }

  .compact-item ha-icon {
    --mdc-icon-size: 20px;
    transition: transform var(--transition-base);
    position: relative;
    z-index: 1;
  }

  .compact-item:hover ha-icon {
    transform: rotate(10deg) scale(1.2);
  }

  .compact-value {
    font-weight: 700;
    color: var(--primary-text-color);
    position: relative;
    z-index: 1;
  }

  .compact-unit {
    font-size: 11px;
    color: var(--secondary-text-color);
    position: relative;
    z-index: 1;
  }

  /* ===== DETAILED LAYOUT - PREMIUM ===== */
  .detailed-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .detailed-item {
    background: linear-gradient(
      135deg,
      var(--card-background-color),
      var(--secondary-background-color)
    );
    border: 1px solid var(--divider-color);
    border-radius: var(--border-radius-xl);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--transition-base);
    position: relative;
  }

  .detailed-item::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at top right,
      var(--primary-color, #44739e)10,
      transparent 60%
    );
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .detailed-item:hover {
    box-shadow: var(--shadow-lg), var(--shadow-glow);
    transform: translateY(-4px);
    border-color: var(--primary-color, #44739e);
  }

  .detailed-item:hover::before {
    opacity: 1;
  }

  .detailed-item.warning {
    border-color: var(--error-color, #f44336);
    box-shadow: 0 0 20px var(--error-color, #f44336)20;
  }

  .detailed-header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px;
    position: relative;
    z-index: 1;
  }

  .detailed-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    --mdc-icon-size: 36px;
    position: relative;
    transition: all var(--transition-slow);
    box-shadow: var(--shadow-md);
  }

  .detailed-icon::before {
    content: '';
    position: absolute;
    inset: -12px;
    border-radius: 50%;
    background: inherit;
    opacity: 0.2;
    filter: blur(16px);
    animation: pulse 3s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.2;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.4;
    }
  }

  .detailed-item:hover .detailed-icon {
    transform: scale(1.1) rotate(360deg);
  }

  .detailed-info {
    flex: 1;
    min-width: 0;
  }

  .detailed-name {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-text-color);
    margin-bottom: 6px;
    letter-spacing: -0.3px;
  }

  .detailed-meta {
    display: flex;
    gap: 10px;
    font-size: 12px;
    color: var(--secondary-text-color);
    flex-wrap: wrap;
  }

  .meta-area {
    padding: 4px 10px;
    background: var(--secondary-background-color);
    border-radius: 12px;
    font-weight: 500;
    transition: all var(--transition-base);
  }

  .meta-area:hover {
    background: var(--primary-color, #44739e);
    color: white;
  }

  .meta-label {
    padding: 4px 10px;
    background: linear-gradient(135deg, var(--primary-color, #44739e), var(--accent-color, #ff9800));
    color: white;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 2px 8px var(--primary-color, #44739e)40;
  }

  .detailed-state {
    text-align: right;
  }

  .detailed-state .state-value {
    font-size: 36px;
    font-weight: 900;
    color: var(--primary-text-color);
    line-height: 1;
    letter-spacing: -1px;
    background: linear-gradient(135deg, var(--primary-text-color), var(--primary-color, #44739e));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .detailed-state .state-unit {
    font-size: 16px;
    color: var(--secondary-text-color);
    font-weight: 600;
    margin-top: 4px;
  }

  .detailed-graph {
    padding: 0 24px 20px;
    position: relative;
    z-index: 1;
  }

  .detailed-graph svg {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    transition: filter var(--transition-base);
  }

  .detailed-item:hover .detailed-graph svg {
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
  }

  .detailed-footer {
    padding: 16px 24px;
    background: linear-gradient(
      to right,
      var(--secondary-background-color),
      transparent
    );
    font-size: 12px;
    color: var(--secondary-text-color);
    border-top: 1px solid var(--divider-color);
    position: relative;
    z-index: 1;
  }

  /* ===== EMPTY STATE ===== */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--secondary-text-color);
  }

  .empty-state ha-icon {
    --mdc-icon-size: 64px;
    margin-bottom: 20px;
    opacity: 0.3;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .empty-state p {
    margin: 0;
    font-size: 15px;
    font-weight: 500;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 600px) {
    ha-card {
      padding: 16px;
    }

    .grid-container {
      grid-template-columns: 1fr;
    }

    .compact-container {
      grid-template-columns: repeat(2, 1fr);
    }

    .detailed-header {
      padding: 16px;
      gap: 16px;
    }

    .detailed-icon {
      width: 52px;
      height: 52px;
      --mdc-icon-size: 28px;
    }

    .detailed-name {
      font-size: 16px;
    }

    .detailed-state .state-value {
      font-size: 28px;
    }

    .card-header {
      font-size: 24px;
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

  @media (prefers-color-scheme: dark) {
    ha-card {
      box-shadow: var(--shadow-lg), 0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    .grid-item,
    .detailed-item {
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }
  }

  /* ===== LOADING STATES ===== */
  @keyframes skeleton {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .loading {
    background: linear-gradient(
      90deg,
      var(--secondary-background-color) 25%,
      var(--divider-color) 50%,
      var(--secondary-background-color) 75%
    );
    background-size: 200% 100%;
    animation: skeleton 1.5s infinite;
  }
`;
