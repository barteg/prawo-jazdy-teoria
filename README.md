# 🚗 Prawo Jazdy — Oficjalna Baza Pytań, Symulator WORD & Kompendium Wiedzy

Nowoczesna aplikacja webowa typu **PWA (Progressive Web App)** zoptymalizowana pod urządzenia mobilne (w tym iPhone / iOS) oraz przeglądarki stacjonarne. Umożliwia kompleksowe przygotowanie do państwowego egzaminu teoretycznego na prawo jazdy w Polsce (kategorie: **B, A, A1, A2, AM, B1, C, C1, D, D1, PT, T**).

---

## ✨ Główne Funkcje

### 1. 📝 Oficjalna Symulacja Egzaminu WORD
- **32 pytania** dobrane losowo według oficjalnych kryteriów Ministerstwa Infrastruktury:
  - **20 pytań podstawowych** (TAK / NIE) — 10x 3 pkt, 6x 2 pkt, 4x 1 pkt.
  - **12 pytań specjalistycznych** (A / B / C) — 6x 3 pkt, 4x 2 pkt, 2x 1 pkt.
- **Punktacja**: Maksymalnie **74 punkty**, próg zdania: **68 punktów (92%)**.
- **Czas**:
  - Łączny czas egzaminu: **25 minut**.
  - Licznik na pytanie podstawowe: **20 sekund**.
  - Licznik na pytanie specjalistyczne: **50 sekund**.
- **Multimedia**: Pełne wsparcie dla oficjalnych materiałów wideo (MP4) i zdjęć (WebP) odtwarzanych z CDN.
- **Ekran wyników**: Status (ZDANY / NIEZDANY), podsumowanie punktów oraz szczegółowy przegląd odpowiedzi z zaznaczeniem błędów.

### 2. 🧠 Tryb Nauki (Quiz & Baza Pytań)
- Przeglądanie całej bazy pytań bez limitu czasu.
- Natychmiastowa informacja zwrotna (kolorowanie poprawnej/błędnej odpowiedzi).
- Filtrowanie: *Wszystkie pytania*, *Tylko podstawowe*, *Tylko specjalistyczne*.
- Wyszukiwarka tekstowa na żywo w treści pytań.
- Losowanie pojedynczego pytania (przycisk 🎲).

### 3. ❌ Trening Błędów (Smart Review)
- Każde pytanie z błędną odpowiedzią (z egzaminu lub trybu nauki) trafia automatycznie do bazy powtórek.
- Dedykowany tryb utrwalania trudnych zagadnień z możliwością odznaczenia jako "Opanowane" po poprawnej odpowiedzi.
- Licznik pozostałych błędów widoczny bezpośrednio na dolnym pasku nawigacyjnym.

### 4. 📖 Bogate Kompendium Wiedzy
Kompletny podręcznik teorii podzielony na interaktywne moduły z wyszukiwarką:
- **Hierarchia na drodze**: Policjant / uprawniony kierujący > Sygnalizacja świetlna > Znaki drogowe > Reguła prawej ręki.
- **Skrzyżowania i pierwszeństwo**: Ronda (NSA, zjazdy, kierunkowskazy), tramwaje (5 żelaznych reguł), korytarz życia i jazda na suwak.
- **Tabela prędkości**: Od 20 km/h w strefie zamieszkania do 140 km/h na autostradzie, reguła bezpiecznego odstępu (połowa prędkości w metrach).
- **Galeria znaków drogowych w SVG**: Znaki ostrzegawcze, zakazu, nakazu, informacyjne z opisami i pułapkami egzaminacyjnymi.
- **Prawo i alkohol**: Różnica między stanem po użyciu alkoholu (0,2 - 0,5‰) a stanem nietrzeźwości (>0,5‰), punkty karne i taryfikator.
- **Wyposażenie i stan techniczny**: Minimalny bieżnik (1,6 mm / TWI), odległości rozstawiania trójkąta (100 m / 30-50 m / za pojazdem).
- **Pierwsza pomoc przedmedyczna (BLS)**: Algorytm RKO 30:2, użycie defibrylatora AED, pozycja boczna ustalona.

### 5. 📊 Statystyki Użytkownika
- Liczba rozwiązanych pytań i podejść do egzaminu.
- Procentowa skuteczność i wskaźnik zdawalności.
- Historia ostatnich egzaminów z dokładnymi wynikami.

---

## 📱 Korzystanie na Telefonie (Offline & Bez Włączonego Komputera)

Aplikacja to pełnoprawna **PWA (Progressive Web App)** z lokalną pamięcią podręczną (Service Worker Cache).

> [!IMPORTANT]
> **Dlaczego iOS wymaga połączenia HTTPS:**
> Zgodnie z polityką bezpieczeństwa Apple (WebKit), przeglądarka **Safari instaluje Service Worker i zapisuje aplikację w pamięci telefonu tylko przez szyfrowane połączenie HTTPS** (zwykłe HTTP po adresie IP `http://192.168.x.x` nie pozwala na zapis offline).
> Gdy dodasz aplikację z adresu HTTPS, cała baza pytań, testy i kompendium zostaną **na stałe pobrane do pamięci Twojego telefonu**. Od tego momentu komputer może być wyłączony, a aplikacja działa w 100% offline (nawet w trybie samolotowym bez internetu)!

### Opcja 1: Stały Darmowy Hosting (GitHub Pages) — Zalecana ⭐
Wystarczy jedna komenda w terminalu:
```bash
npm run deploy
```
Komenda automatycznie:
1. Zapisze zmiany w repozytorium GitHub.
2. Włączy **GitHub Pages** (darmowy, bezpieczny hosting HTTPS).
3. Wygeneruje Twój stały link: `https://<twoj-login>.github.io/prawo-jazdy-teoria/`.

**Na telefonie (iPhone / Safari):**
1. Otwórz wygenerowany link `https://<twoj-login>.github.io/prawo-jazdy-teoria/`.
2. Dotknij przycisku **Udostępnij** ⎋ na dolnym pasku Safari.
3. Wybierz **„Do ekranu początkowego”** (*Add to Home Screen*) i kliknij **„Dodaj”**.
4. **Gotowe!** Komputer nie jest już potrzebny. Aplikacja uruchamia się jak natywna z pulpitu telefonu i działa zawsze i wszędzie offline.

---

### Opcja 2: Szybki Tunel HTTPS z Komputera
Jeśli chcesz szybko zainstalować aplikację bez publikowania na GitHub Pages:
```bash
npm run tunnel
```
Serwer uruchomi bezpieczny tunel HTTPS i wyświetli link (np. `https://xyz.loca.lt`). Otwórz ten link na telefonie, dodaj do ekranu początkowego — dzięki HTTPS aplikacja pobierze bazę pytań do pamięci Safari, po czym możesz zamknąć serwer i wyłączyć komputer.

---

## 🚀 Uruchomienie Lokalnego Serwera

```bash
# Uruchomienie standardowe lokalnie
npm start

# Uruchomienie z tunelem HTTPS
npm run tunnel

# Wdrożenie na GitHub Pages
npm run deploy
```

---

## 📁 Struktura Projektu

```text
prawo-jazdy-teoria/
├── data/                       # Pobrana oficjalna baza pytań (17 000+ pytań)
│   ├── meta.json               # Reguły egzaminu i zestawienie kategorii
│   ├── B.json                  # Kategoria B (2 167 pytań)
│   └── A.json, C.json, ...     # Pozostałe kategorie (A, AM, C, D, T...)
├── src/
│   ├── app.js                  # Logika egzaminu, nawigacja, nauka, błędy, statystyki
│   ├── compendium-data.js      # Treść modułów kompendium wiedzy
│   ├── signs-data.js           # Wektory SVG i opisy znaków drogowych
│   ├── styles.css              # Style Apple iOS (Safe Area, Dark/Light mode)
│   └── icons/                  # Ikony PWA i Apple Touch Icon
├── index.html                  # Główny interfejs aplikacji PWA
├── manifest.webmanifest        # Konfiguracja PWA Standalone dla iOS/Android
├── sw.js                       # Service Worker (offline cache)
├── server.js                   # Lekki serwer HTTP z wykrywaniem IP LAN
├── package.json
└── README.md
```
