# Entity Display Card - Rychlý start

## 🚀 Instalace

1. Zkopírujte `entity-display-card.js` do složky `www` v Home Assistant
2. Přidejte kartu jako prostředek v Lovelace:

```yaml
resources:
  - url: /local/entity-display-card.js
    type: module
```

3. Restartujte Home Assistant nebo obnovte frontend (Ctrl+F5)

## 📋 Základní použití

### Příklad 1: Teploty v domě (seznam)

```yaml
type: custom:entity-display-card
title: "🌡️ Teploty"
filter:
  device_class:
    - temperature
```

**Co to dělá:**
- Automaticky najde všechny teplotní senzory
- Zobrazí je jako seznam s ikonami a barvami podle hodnoty
- Studená teplota = modrá, teplá = červená

### Příklad 2: Mřížka s klimatem

```yaml
type: custom:entity-display-card
title: "Klima"
layout: grid
columns: 2
filter:
  device_class:
    - temperature
    - humidity
```

**Co to dělá:**
- Zobrazí teplotu a vlhkost v mřížce (2 sloupce)
- Každá karta má barevnou ikonu podle hodnoty
- Automaticky seskupí podle typu

### Příklad 3: Baterie k výměně

```yaml
type: custom:entity-display-card
title: "⚠️ Baterie"
filter:
  device_class:
    - battery
sort_by: state
```

**Co to dělá:**
- Zobrazí všechny baterie
- Seřadí od nejnižší po nejvyšší
- Zvýrazní červeně slabé baterie (< 20%)

## 🎨 Layouty

Změňte `layout` pro různé styly zobrazení:

| Layout | Popis | Použití |
|--------|-------|---------|
| `list` | Seznam (výchozí) | Univerzální, hodně entit |
| `grid` | Mřížka karet | Moderní přehled |
| `gauge` | Ukazatele | Vizuální sledování |
| `compact` | Kompaktní | Málo místa, hodně dat |
| `detailed` | Podrobné | Detailní info + grafy |

## 🎯 Nejčastější použití

### Dashboard s přehledem domu

```yaml
# Horní karta - teploty
- type: custom:entity-display-card
  title: "🌡️ Teploty"
  layout: grid
  columns: 3
  filter:
    device_class:
      - temperature

# Střední karta - kvalita vzduchu
- type: custom:entity-display-card
  title: "🌬️ Vzduch"
  layout: gauge
  filter:
    device_class:
      - humidity
      - carbon_dioxide

# Spodní karta - baterie
- type: custom:entity-display-card
  title: "🔋 Baterie"
  layout: compact
  columns: 4
  filter:
    device_class:
      - battery
  sort_by: state
```

### Mobilní dashboard (kompaktní)

```yaml
type: custom:entity-display-card
layout: compact
columns: 2
show_header: false
filter:
  device_class:
    - temperature
    - humidity
```

### Detailní monitoring

```yaml
type: custom:entity-display-card
title: "Podrobný přehled"
layout: detailed
show_graph: true
show_last_changed: true
group_by: area
filter:
  device_class:
    - temperature
    - humidity
    - carbon_dioxide
```

## ⚙️ Všechny možnosti

```yaml
type: custom:entity-display-card

# Základní
title: "Název karty"                # Text v hlavičce
layout: list                        # list/grid/gauge/compact/detailed
columns: 2                          # Počet sloupců (grid/compact)

# Seskupení a řazení
group_by: type                      # type/area/floor/none
sort_by: name                       # name/state/last_changed/area

# Zobrazení
show_header: true                   # Zobrazit hlavičku
show_icon: true                     # Zobrazit ikony
show_name: true                     # Zobrazit názvy
show_state: true                    # Zobrazit hodnoty
show_unit: true                     # Zobrazit jednotky
show_last_changed: false            # Zobrazit čas změny
show_graph: false                   # Zobrazit grafy

# Filtry
filter:
  device_class:                     # Typy senzorů
    - temperature
    - humidity
    - battery

# Nebo manuální entity
entities:
  - sensor.living_room_temperature
  - sensor.bedroom_humidity
```

## 🌈 Podporované typy (device_class)

Karta automaticky rozpozná a barevně zobrazí:

- ✅ **temperature** - Teplota (°C)
- ✅ **humidity** - Vlhkost (%)
- ✅ **battery** - Baterie (%)
- ✅ **pressure** - Tlak (hPa)
- ✅ **illuminance** - Osvětlení (lx)
- ✅ **power** - Výkon (W)
- ✅ **energy** - Energie (kWh)
- ✅ **carbon_dioxide** - CO₂ (ppm)
- ✅ **volatile_organic_compounds** - VOC (µg/m³)
- ✅ **pm25** - Jemné částice (µg/m³)
- ✅ **signal_strength** - Signál (dBm)

## 💡 Tipy a triky

### Jak zjistit device_class entity?

1. Jděte do **Developer Tools** → **States**
2. Najděte svou entitu (např. `sensor.living_room_temperature`)
3. Podívejte se na **Attributes** → hledejte `device_class`

### Proč se mi nezobrazují entity?

1. Zkontrolujte, že entity mají správný `device_class`
2. Použijte místo filtru manuální seznam:
   ```yaml
   entities:
     - sensor.my_sensor
   ```

### Jak změnit barvy?

Barvy jsou automatické podle hodnoty. Například:
- Teplota < 18°C = modrá
- Teplota 18-24°C = zelená
- Teplota > 28°C = červená

### Můžu kombinovat filtry a manuální entity?

Ano!
```yaml
type: custom:entity-display-card
entities:
  - sensor.important_sensor
filter:
  device_class:
    - temperature
```

## 🐛 Řešení problémů

**Karta se nezobrazuje:**
- Zkontrolujte konzoli prohlížeče (F12)
- Ověřte, že je správně přidána do resources
- Restartujte Home Assistant

**Špatné barvy:**
- Karta používá Home Assistant CSS proměnné
- Zkontrolujte svůj theme

**Žádné entity:**
- Použijte Developer Tools → States
- Ověřte device_class vašich entit

## 📚 Další dokumentace

Pro pokročilé použití a všechny funkce viz [ENTITY-DISPLAY-CARD.md](./ENTITY-DISPLAY-CARD.md)

## ❤️ Podpora

Líbí se vám karta? Dejte ⭐ na GitHubu!
