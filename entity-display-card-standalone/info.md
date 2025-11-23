# Entity Display Card

Pokročilá karta pro Home Assistant s automatickými filtry a vizualizacemi.

## Funkce

✨ **Automatické filtry** - Filtruj entity podle device_class, domain, area, floor
📊 **Grafy** - Historická data s hladkými křivkami
🎨 **Různé layouty** - List, Grid, Gauge, Compact, Detailed
🌈 **Barevné rozsahy** - Automatické barvy podle hodnot
⚠️ **Varování** - Upozornění na kritické hodnoty
🌐 **Vícejazyčnost** - Česky / English
🚫 **Vyloučení entit** - Možnost vyloučit konkrétní entity ze zobrazení

## Podporované typy senzorů

- 🌡️ Teplota (temperature)
- 💧 Vlhkost (humidity)
- 🔋 Baterie (battery)
- 📊 Tlak vzduchu (pressure)
- 💡 Osvětlení (illuminance)
- ⚡ Výkon (power)
- 🔌 Energie (energy)
- 🌫️ CO₂ (carbon_dioxide)
- 🌬️ VOC (volatile_organic_compounds)
- 🌫️ PM2.5 (pm25)
- 📶 Síla signálu (signal_strength)

## Instalace

### HACS (doporučeno)

1. Otevři HACS
2. Přejdi na "Frontend"
3. Klikni na "..." vpravo nahoře
4. Vyber "Custom repositories"
5. Přidej URL: `https://github.com/joshuaaaaa/Entity-display-card`
6. Kategorie: `Lovelace`
7. Klikni "Add"
8. Najdi "Entity Display Card" a klikni "Download"
9. Restartuj Home Assistant

### Manuální instalace

1. Stáhni `entity-display-card.js` z nejnovější release
2. Zkopíruj do `config/www/entity-display-card.js`
3. Přidej do configuration.yaml:
```yaml
lovelace:
  resources:
    - url: /local/entity-display-card.js
      type: module
```
4. Restartuj Home Assistant

## Základní příklad

```yaml
type: custom:entity-display-card
title: "Teploty v domě"
layout: detailed
show_graph: true
filter:
  device_class:
    - temperature
```

## Další informace

Kompletní dokumentaci najdeš v [README](https://github.com/joshuaaaaa/Entity-display-card/blob/main/README.md).
