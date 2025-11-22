# Entity Display Card

Pokročilá Lovelace karta pro zobrazení entit s automatickým rozpoznáním typů, barevnými rozsahy a různými layouty.

## Funkce

- ✨ **Automatické rozpoznání typů** - Detekuje device_class (teplota, vlhkost, baterie atd.)
- 🎨 **Barevné gradienty** - Hodnoty jsou obarveny podle rozsahů (např. studená/teplá teplota)
- ⚠️ **Varování** - Automatické zvýraznění kritických hodnot
- 📊 **Různé layouty** - List, Grid, Gauge, Compact, Detailed
- 🔍 **Filtry** - Pokročilé filtrování podle device_class, domény, oblasti atd.
- 📁 **Seskupování** - Podle typu, oblasti nebo patra
- 📈 **Grafy** - Podpora pro zobrazení historických dat (v detailed režimu)
- 🎯 **Ikony podle hodnot** - Automatické ikony podle rozsahu (např. baterie 10%, 50%, 100%)

## Instalace

1. Zkopírujte `entity-display-card.js` do složky `www` ve vašem Home Assistant
2. Přidejte kartu jako prostředek:

```yaml
resources:
  - url: /local/entity-display-card.js
    type: module
```

## Podporované typy entit

Karta automaticky rozpozná a správně zobrazí následující device classes:

| Device Class | Popis | Jednotka | Rozsahy |
|--------------|-------|----------|---------|
| `temperature` | Teplota | °C | Studené (< 10°C) → Horúce (> 28°C) |
| `humidity` | Vlhkost | % | Suché (< 30%) → Vlhké (> 70%) |
| `battery` | Baterie | % | Kritické (< 10%) → Plné (> 80%) |
| `pressure` | Atmosférický tlak | hPa | Nízký (< 980) → Vysoký (> 1020) |
| `illuminance` | Osvětlení | lx | Tma (< 1) → Velmi svetlé (> 500) |
| `power` | Spotřeba energie | W | Nízký (< 10W) → Velmi vysoký (> 500W) |
| `energy` | Celková energie | kWh | Nízká (< 1) → Velmi vysoká (> 10) |
| `carbon_dioxide` | CO₂ | ppm | Výborné (< 600) → Zlé (> 1500) |
| `volatile_organic_compounds` | VOC | µg/m³ | Výborné (< 50) → Zlé (> 500) |
| `pm25` | Jemné částice | µg/m³ | Dobré (< 12) → Nezdravé (> 55) |
| `signal_strength` | Síla signálu | dBm | Slabý (< -90) → Výborný (> -50) |

## Základní použití

### Jednoduchý seznam teplotních senzorů

```yaml
type: custom:entity-display-card
title: "Teploty v domě"
filter:
  device_class:
    - temperature
```

### Mřížka s teplotou a vlhkostí

```yaml
type: custom:entity-display-card
title: "Klima v domě"
layout: grid
columns: 2
filter:
  device_class:
    - temperature
    - humidity
```

### Podrobné zobrazení s grafy

```yaml
type: custom:entity-display-card
title: "Přehled senzorů"
layout: detailed
show_graph: true
group_by: area
filter:
  device_class:
    - temperature
    - humidity
    - carbon_dioxide
```

## Layouty

### List (výchozí)
Klasické seznamové zobrazení s ikonou, názvem a hodnotou.

```yaml
type: custom:entity-display-card
title: "Seznam senzorů"
layout: list
```

### Grid
Mřížkové zobrazení s kartami pro každou entitu.

```yaml
type: custom:entity-display-card
title: "Mřížka senzorů"
layout: grid
columns: 3  # 1-6 sloupců
```

### Gauge
Zobrazení s pruhovými ukazateli.

```yaml
type: custom:entity-display-card
title: "Ukazatele"
layout: gauge
```

### Compact
Kompaktní zobrazení s minimem informací.

```yaml
type: custom:entity-display-card
title: "Kompaktní přehled"
layout: compact
columns: 4
show_name: false
```

### Detailed
Podrobné zobrazení s metadaty a grafy.

```yaml
type: custom:entity-display-card
title: "Podrobné info"
layout: detailed
show_graph: true
show_last_changed: true
```

## Filtry

### Device Class
Filtrování podle typu senzoru:

```yaml
type: custom:entity-display-card
filter:
  device_class:
    - temperature
    - humidity
    - battery
```

### Manuální entity
Explicitní výběr entit:

```yaml
type: custom:entity-display-card
entities:
  - sensor.living_room_temperature
  - sensor.bedroom_temperature
  - sensor.kitchen_humidity
```

### Kombinace filtrů a manuálních entit
```yaml
type: custom:entity-display-card
entities:
  - sensor.important_sensor
filter:
  device_class:
    - temperature
```

## Seskupování

### Podle typu (device_class)
```yaml
type: custom:entity-display-card
group_by: type
```

### Podle oblasti
```yaml
type: custom:entity-display-card
group_by: area
```

### Podle patra
```yaml
type: custom:entity-display-card
group_by: floor
```

## Řazení

```yaml
type: custom:entity-display-card
sort_by: name      # name, state, last_changed, area
```

## Možnosti zobrazení

```yaml
type: custom:entity-display-card
show_header: true          # Zobrazit hlavičku karty
show_icon: true            # Zobrazit ikony
show_name: true            # Zobrazit názvy entit
show_state: true           # Zobrazit hodnoty
show_unit: true            # Zobrazit jednotky
show_last_changed: false   # Zobrazit čas poslední změny
show_graph: false          # Zobrazit grafy (detailed layout)
```

## Pokročilé příklady

### Dashboard s přehledem klimatu
```yaml
type: custom:entity-display-card
title: "🌡️ Klima v domě"
layout: detailed
group_by: area
show_graph: true
show_last_changed: true
filter:
  device_class:
    - temperature
    - humidity
    - carbon_dioxide
    - volatile_organic_compounds
sort_by: area
```

### Upozornění na slabé baterie
```yaml
type: custom:entity-display-card
title: "⚠️ Baterie k výměně"
layout: list
filter:
  device_class:
    - battery
sort_by: state  # Od nejnižší po nejvyšší
```

### Kompaktní přehled na mobilu
```yaml
type: custom:entity-display-card
title: "Quick Stats"
layout: compact
columns: 2
show_name: false
show_header: false
filter:
  device_class:
    - temperature
    - humidity
    - battery
```

### Energetický monitoring
```yaml
type: custom:entity-display-card
title: "⚡ Spotřeba energie"
layout: gauge
filter:
  device_class:
    - power
    - energy
sort_by: state
```

### Kvalita vzduchu
```yaml
type: custom:entity-display-card
title: "🌬️ Kvalita vzduchu"
layout: detailed
show_graph: true
filter:
  device_class:
    - carbon_dioxide
    - volatile_organic_compounds
    - pm25
group_by: area
```

## Barevné rozsahy

Každý typ entity má přednastavené barevné rozsahy, které automaticky obarvují hodnoty:

### Teplota
- 🔵 Studené (< 10°C) - modrá
- 🔵 Chladné (10-18°C) - světle modrá
- 🟢 Příjemné (18-24°C) - zelená
- 🟡 Teplé (24-28°C) - oranžová
- 🔴 Horúce (> 28°C) - červená ⚠️

### Baterie
- 🔴 Kritické (< 10%) - červená ⚠️
- 🟠 Nízké (10-20%) - oranžová ⚠️
- 🟡 Střední (20-50%) - žlutá
- 🟢 Dobré (50-80%) - zelená
- 🔵 Plné (> 80%) - modrá

### CO₂
- 🟢 Výborné (< 600 ppm)
- 🔵 Dobré (600-800 ppm)
- 🟡 Střední (800-1000 ppm)
- 🟠 Horší (1000-1500 ppm) ⚠️
- 🔴 Zlé (> 1500 ppm) ⚠️

## Známé omezení

- Grafy jsou zatím placeholder (zobrazují se jako "Graf (historie 24h)")
- Pro plnou funkčnost grafů je potřeba implementovat integraci s History API
- Některé filtry (např. area) vyžadují entity registry a fungují až po načtení

## Roadmap

- [ ] Implementace skutečných grafů s historickými daty
- [ ] Možnost vlastních barevných rozsahů pro každou entitu
- [ ] Animace při změně hodnot
- [ ] Export dat do CSV/JSON
- [ ] Tmavý/světlý režim s vlastními barvami
- [ ] Podpora pro více jednotek (°F, Fahrenheit atd.)
- [ ] Mini-karty pro jednotlivé entity (tap to expand)
- [ ] Srovnání hodnot mezi místnostmi

## Podpora

Pro hlášení chyb nebo návrhy vytvořte issue na GitHubu.

## Licence

Stejná jako lovelace-auto-entities projekt.
