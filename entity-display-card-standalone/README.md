# Entity Display Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![License](https://img.shields.io/github/license/joshuaaaaa/Entity-display-card)](https://github.com/joshuaaaaa/Entity-display-card/blob/main/LICENSE)

Pokročilá custom karta pro Home Assistant s automatickými filtry, grafy a vizualizacemi entit.

![Entity Display Card](https://via.placeholder.com/800x400.png?text=Entity+Display+Card+Screenshot)

## ✨ Funkce

- 🔍 **Automatické filtry** - Filtruj entity podle device_class, domain, area, floor
- 📊 **Historické grafy** - Zobrazení historie s hladkými křivkami (inspirováno mini-graph-card)
- 🎨 **5 layoutů** - List, Grid, Gauge, Compact, Detailed
- 🌈 **Barevné rozsahy** - Automatické barvy a ikony podle hodnot
- ⚠️ **Varování** - Upozornění na kritické hodnoty (nízká baterie, vysoké CO₂, atd.)
- 🌐 **Vícejazyčnost** - Česky / English
- 📱 **Responzivní** - Přizpůsobí se velikosti obrazovky
- 🚫 **Vyloučení entit** - Možnost vyloučit konkrétní entity ze zobrazení
- ⚙️ **Plně konfigurovatelné** - Editor s 5 záložkami pro snadnou konfiguraci

## 📦 Instalace

### HACS (doporučeno)

1. Otevři HACS v Home Assistant
2. Přejdi na "Frontend"
3. Klikni na "..." vpravo nahoře
4. Vyber "Custom repositories"
5. Přidej URL: `https://github.com/joshuaaaaa/Entity-display-card`
6. Kategorie: `Lovelace`
7. Klikni "Add"
8. Najdi "Entity Display Card" v seznamu a klikni "Download"
9. Restartuj Home Assistant
10. Vyčisti cache prohlížeče (Ctrl+F5)

### Manuální instalace

1. Stáhni `entity-display-card.js` z [nejnovější release](https://github.com/joshuaaaaa/Entity-display-card/releases)
2. Zkopíruj soubor do `config/www/entity-display-card.js`
3. Přidej do `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/entity-display-card.js
      type: module
```

4. Restartuj Home Assistant
5. Vyčisti cache prohlížeče (Ctrl+F5)

## 🚀 Rychlý start

### Základní příklad

```yaml
type: custom:entity-display-card
title: "Teploty v domě"
layout: list
filter:
  device_class:
    - temperature
```

### S grafy

```yaml
type: custom:entity-display-card
title: "Klima v domě"
layout: detailed
show_graph: true
graph_hours: 24
group_by: area
filter:
  device_class:
    - temperature
    - humidity
```

### Grid layout

```yaml
type: custom:entity-display-card
title: "Senzory"
layout: grid
columns: 2
group_by: type
filter:
  device_class:
    - temperature
    - humidity
    - battery
```

## 📖 Konfigurace

### Základní parametry

| Parametr | Typ | Výchozí | Popis |
|----------|-----|---------|-------|
| `type` | string | **povinné** | `custom:entity-display-card` |
| `title` | string | - | Nadpis karty |
| `layout` | string | `list` | Typ layoutu: `list`, `grid`, `gauge`, `compact`, `detailed` |
| `columns` | number | `2` | Počet sloupců (pro grid a compact) |
| `group_by` | string | `none` | Seskupit podle: `type`, `area`, `floor`, `none` |
| `show_header` | boolean | `true` | Zobrazit nadpis |
| `show_icon` | boolean | `true` | Zobrazit ikony |
| `show_name` | boolean | `true` | Zobrazit jména entit |
| `show_state` | boolean | `true` | Zobrazit stavy |
| `show_unit` | boolean | `true` | Zobrazit jednotky |
| `show_last_changed` | boolean | `false` | Zobrazit čas poslední změny |
| `show_graph` | boolean | `false` | Zobrazit grafy (pouze detailed layout) |

### Řazení

| Parametr | Typ | Výchozí | Popis |
|----------|-----|---------|-------|
| `sort_by` | string | `name` | Řadit podle: `name`, `state`, `last_changed`, `area` |
| `sort_reverse` | boolean | `false` | Obrátit pořadí |
| `max_entities` | number | - | Maximální počet zobrazených entit |
| `ignore_invalid` | boolean | `false` | Ignorovat neplatné stavy (unknown, unavailable, atd.) |

### Filtry

```yaml
filter:
  device_class:
    - temperature
    - humidity
  domain:
    - sensor
  include:
    - domain: sensor
      device_class: temperature
      area: living_room
  exclude:
    - entity_id: sensor.temp_outside
```

### Vyloučení entit

Můžeš přímo vybrat entity, které se nemají zobrazovat:

```yaml
entities:
  - sensor.temp_bedroom
  - sensor.temp_kitchen
exclude_entities:
  - sensor.temp_outside  # Tuto entitu nechci zobrazovat
  - sensor.temp_garage
```

### Konfigurace grafů

| Parametr | Typ | Výchozí | Popis |
|----------|-----|---------|-------|
| `graph_type` | string | `line` | Typ grafu: `line`, `area`, `bar` |
| `graph_hours` | number | `24` | Počet hodin historie |
| `graph_height` | number | `100` | Výška grafu v pixelech |
| `graph_line_color` | string | `var(--primary-color)` | Barva křivky (hex nebo CSS proměnná) |
| `graph_fill` | boolean | `true` | Vyplnit plochu pod křivkou |

## 🎨 Layouty

### List
Klasický seznam entit s ikonami a hodnotami.

```yaml
type: custom:entity-display-card
layout: list
```

### Grid
Mřížka karet s ikonami a hodnotami.

```yaml
type: custom:entity-display-card
layout: grid
columns: 2
```

### Gauge
Vizualizace s progress bary.

```yaml
type: custom:entity-display-card
layout: gauge
```

### Compact
Kompaktní zobrazení pouze s ikonou a hodnotou.

```yaml
type: custom:entity-display-card
layout: compact
columns: 3
show_name: false
```

### Detailed
Detailní zobrazení s grafy a metadata.

```yaml
type: custom:entity-display-card
layout: detailed
show_graph: true
graph_hours: 24
```

## 📊 Podporované typy senzorů

Karta má přednastavené konfigurace pro tyto typy:

| Typ | Device Class | Ikona | Barevné rozsahy |
|-----|--------------|-------|-----------------|
| 🌡️ Teplota | `temperature` | mdi:thermometer | 5 rozsahů (-∞ až 10°C: ❄️, 10-18°C: 🥶, 18-24°C: ✅, 24-28°C: 🌡️, 28+°C: 🔥) |
| 💧 Vlhkost | `humidity` | mdi:water-percent | 5 rozsahů (0-30%: ⚠️, 30-40%: ↓, 40-60%: ✅, 60-70%: ↑, 70+%: ⚠️) |
| 🔋 Baterie | `battery` | mdi:battery | 5 rozsahů (0-10%: 🚨, 10-20%: ⚠️, 20-50%: 📊, 50-80%: ✅, 80+%: 🔋) |
| 📊 Tlak | `pressure` | mdi:gauge | 4 rozsahy |
| 💡 Osvětlení | `illuminance` | mdi:brightness-5 | 5 rozsahů |
| ⚡ Výkon | `power` | mdi:flash | 4 rozsahy |
| 🔌 Energie | `energy` | mdi:lightning-bolt | 4 rozsahy |
| 🌫️ CO₂ | `carbon_dioxide` | mdi:molecule-co2 | 5 rozsahů (0-600: ✅, 600-800: 📊, 800-1000: ⚠️, 1000-1500: 🚨, 1500+: ☠️) |
| 🌬️ VOC | `volatile_organic_compounds` | mdi:air-filter | 5 rozsahů |
| 🌫️ PM2.5 | `pm25` | mdi:dots-hexagon | 4 rozsahy |
| 📶 Síla signálu | `signal_strength` | mdi:wifi | 4 rozsahy |

Každý typ má:
- ✅ Přednastavenou ikonu
- 🎨 Barevné rozsahy podle hodnoty
- ⚠️ Automatická varování při kritických hodnotách
- 📊 Podporu pro grafy (kde má smysl)

## 💡 Příklady použití

### Všechny teplotní senzory

```yaml
type: custom:entity-display-card
title: "Teploty v domě"
layout: grid
columns: 2
filter:
  device_class:
    - temperature
```

### Klima v domě (teplota + vlhkost)

```yaml
type: custom:entity-display-card
title: "Klima v domě"
layout: detailed
group_by: area
show_graph: true
filter:
  device_class:
    - temperature
    - humidity
```

### Slabé baterie

```yaml
type: custom:entity-display-card
title: "Baterie k výměně"
layout: list
sort_by: state
filter:
  device_class:
    - battery
```

### Gauge zobrazení všech senzorů

```yaml
type: custom:entity-display-card
title: "Přehled senzorů"
layout: gauge
group_by: type
filter:
  device_class:
    - temperature
    - humidity
    - pressure
    - illuminance
    - battery
```

### Kompaktní přehled

```yaml
type: custom:entity-display-card
title: "Quick View"
layout: compact
columns: 3
show_name: false
filter:
  device_class:
    - temperature
    - humidity
    - battery
```

### S vyloučením konkrétních entit

```yaml
type: custom:entity-display-card
title: "Teploty (bez venkovních)"
layout: list
filter:
  device_class:
    - temperature
exclude_entities:
  - sensor.temp_outside
  - sensor.temp_garage
```

## 🛠️ Vývoj

### Požadavky

- Node.js 18+
- npm

### Build

```bash
npm install
npm run build
```

### Watch mode

```bash
npm run watch
```

## 📝 Changelog

### v1.0.0
- ✨ První vydání
- 📊 Grafy s hladkými křivkami
- 🎨 5 layoutů
- 🌈 Barevné rozsahy pro 11 typů senzorů
- 🌐 Česká a anglická lokalizace
- 🚫 Možnost vyloučit konkrétní entity

## 🤝 Přispívání

Pull requesty jsou vítány! Pro velké změny prosím nejdřív otevři issue.

## 📄 Licence

[MIT](LICENSE)

## 🙏 Poděkování

- Inspirováno [mini-graph-card](https://github.com/kalkih/mini-graph-card) pro grafy
- Děkuji komunitě Home Assistant

---

Pokud se ti karta líbí, dej ⭐ na GitHubu!
