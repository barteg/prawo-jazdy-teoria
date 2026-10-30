// signs-data.js — Najważniejsze znaki drogowe z oficjalnym oznaczeniem, opisem i grafiką SVG

export const ROAD_SIGNS = [
  {
    code: "A-7",
    category: "Ostrzegawcze",
    name: "Ustąp pierwszeństwa",
    desc: "Ostrzega o skrzyżowaniu z drogą z pierwszeństwem. Zobowiązuje do ustąpienia pierwszeństwa kierującym na drodze z pierwszeństwem. Nie wymaga bezwzględnego zatrzymania, jeśli droga jest wolna.",
    svg: `<svg viewBox="0 0 100 100" class="sign-svg"><polygon points="10,15 90,15 50,88" fill="#ffcc00" stroke="#d90429" stroke-width="10" stroke-linejoin="round"/></svg>`
  },
  {
    code: "B-20",
    category: "Zakazu",
    name: "STOP",
    desc: "Znak zakazu wjazdu na skrzyżowanie bez uprzedniego zatrzymania się. Wymaga całkowitego zatrzymania kół (prędkość = 0 km/h) przed linią bezwzględnego zatrzymania lub w miejscu zapewniającym widoczność.",
    svg: `<svg viewBox="0 0 100 100" class="sign-svg"><polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#d90429" stroke="#ffffff" stroke-width="3"/><text x="50" y="58" font-size="24" font-weight="900" font-family="sans-serif" fill="#ffffff" text-anchor="middle">STOP</text></svg>`
  },
  {
    code: "D-1",
    category: "Informacyjne",
    name: "Droga z pierwszeństwem",
    desc: "Oznacza początek lub kontynuację drogi z pierwszeństwem przejazdu przez skrzyżowania z innymi drogami aż do znaku D-2 (Koniec drogi z pierwszeństwem).",
    svg: `<svg viewBox="0 0 100 100" class="sign-svg"><rect x="15" y="15" width="70" height="70" transform="rotate(45 50 50)" fill="#ffcc00" stroke="#ffffff" stroke-width="8" rx="4"/></svg>`
  },
  {
    code: "C-12",
    category: "Nakazu",
    name: "Ruch okrężny",
    desc: "Oznacza ruch dookoła wyspy lub placu w kierunku wskazanym na znaku (przeciwnie do ruchu wskazówek zegara). W połączeniu ze znakiem A-7 daje pierwszeństwo pojazdom będącym na rondzie.",
    svg: `<svg viewBox="0 0 100 100" class="sign-svg"><circle cx="50" cy="50" r="45" fill="#0056b3"/><path d="M50 20 A30 30 0 0 1 80 50" fill="none" stroke="#fff" stroke-width="6" marker-end="url(#arrow)"/><path d="M80 50 A30 30 0 0 1 50 80" fill="none" stroke="#fff" stroke-width="6"/><path d="M50 80 A30 30 0 0 1 20 50" fill="none" stroke="#fff" stroke-width="6"/><polygon points="80,50 85,38 75,38" fill="#fff"/><polygon points="50,80 62,85 62,75" fill="#fff"/><polygon points="20,50 15,62 25,62" fill="#fff"/></svg>`
  },
  {
    code: "B-25",
    category: "Zakazu",
    name: "Zakaz wyprzedzania",
    desc: "Zabrania wyprzedzania pojazdów silnikowych wielośladowych (samochodów, ciągników). Wolno wyprzedzić pojazd jednośladowy (rower, motorower, motocykl bez bocznego wózka), o ile nie przekracza się linii ciągłej.",
    svg: `<svg viewBox="0 0 100 100" class="sign-svg"><circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#d90429" stroke-width="9"/><rect x="30" y="42" width="16" height="24" rx="3" fill="#d90429"/><rect x="54" y="42" width="16" height="24" rx="3" fill="#1e293b"/></svg>`
  },
  {
    code: "B-33",
    category: "Zakazu",
    name: "Ograniczenie prędkości (np. 50 km/h)",
    desc: "Zakazuje przekraczania prędkości określonej na znaku cyfrą w km/h. Obowiązuje do najbliższego skrzyżowania lub znaku odwołującego.",
    svg: `<svg viewBox="0 0 100 100" class="sign-svg"><circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#d90429" stroke-width="9"/><text x="50" y="60" font-size="32" font-weight="900" font-family="sans-serif" fill="#1e293b" text-anchor="middle">50</text></svg>`
  },
  {
    code: "D-40",
    category: "Informacyjne",
    name: "Strefa zamieszkania",
    desc: "Maksymalna prędkość 20 km/h. Pieszy ma pierwszeństwo na całej szerokości drogi i może korzystać z całej jezdni. Dziecko do 7 lat może poruszać się samo. Postój tylko w miejscach wyznaczonych.",
    svg: `<svg viewBox="0 0 100 100" class="sign-svg"><rect x="10" y="10" width="80" height="80" rx="8" fill="#0056b3"/><circle cx="35" cy="30" r="6" fill="#fff"/><circle cx="68" cy="40" r="4" fill="#fff"/><rect x="25" y="65" width="28" height="14" rx="2" fill="#fff"/></svg>`
  },
  {
    code: "D-42",
    category: "Informacyjne",
    name: "Obszar zabudowany",
    desc: "Oznacza wjazd w obszar zabudowany. Dopuszczalna prędkość wynosi 50 km/h przez całą dobę (chyba że znaki wskazują inaczej).",
    svg: `<svg viewBox="0 0 100 100" class="sign-svg"><rect x="5" y="20" width="90" height="60" rx="6" fill="#ffffff" stroke="#1e293b" stroke-width="4"/><polygon points="20,70 20,50 35,50 35,70" fill="#1e293b"/><polygon points="40,70 40,35 60,35 60,70" fill="#1e293b"/><polygon points="65,70 65,45 80,45 80,70" fill="#1e293b"/></svg>`
  },
  {
    code: "A-16",
    category: "Ostrzegawcze",
    name: "Przejście dla pieszych",
    desc: "Ostrzega o zbliżaniu się do przejścia dla pieszych. Bezwzględny zakaz wyprzedzania na przejściu i bezpośrednio przed nim oraz zakaz omijania pojazdu, który zatrzymał się, by ustąpić pieszemu!",
    svg: `<svg viewBox="0 0 100 100" class="sign-svg"><polygon points="50,10 90,85 10,85" fill="#ffcc00" stroke="#d90429" stroke-width="8" stroke-linejoin="round"/><circle cx="50" cy="42" r="5" fill="#1e293b"/><path d="M42 55 L58 55 L52 75" fill="none" stroke="#1e293b" stroke-width="4"/></svg>`
  },
  {
    code: "B-36",
    category: "Zakazu",
    name: "Zakaz zatrzymywania się",
    desc: "Zabrania zatrzymania pojazdu z przyczyn innych niż wynikające z warunków lub przepisów ruchu drogowego (nawet na sekundę).",
    svg: `<svg viewBox="0 0 100 100" class="sign-svg"><circle cx="50" cy="50" r="45" fill="#0056b3" stroke="#d90429" stroke-width="9"/><line x1="18" y1="18" x2="82" y2="82" stroke="#d90429" stroke-width="9"/><line x1="82" y1="18" x2="18" y2="82" stroke="#d90429" stroke-width="9"/></svg>`
  },
  {
    code: "B-35",
    category: "Zakazu",
    name: "Zakaz postoju",
    desc: "Zabrania postoju pojazdu (unieruchomienia powyżej 1 minuty niewynikającego z warunków ruchu). Zatrzymanie do 1 minuty w celu wsiadania/wysiadania pasażera jest dozwolone.",
    svg: `<svg viewBox="0 0 100 100" class="sign-svg"><circle cx="50" cy="50" r="45" fill="#0056b3" stroke="#d90429" stroke-width="9"/><line x1="82" y1="18" x2="18" y2="82" stroke="#d90429" stroke-width="9"/></svg>`
  },
  {
    code: "B-2",
    category: "Zakazu",
    name: "Zakaz wjazdu",
    desc: "Oznacza zakaz wjazdu pojazdów na drogę od strony umieszczenia znaku (np. na drogę jednokierunkową od końca).",
    svg: `<svg viewBox="0 0 100 100" class="sign-svg"><circle cx="50" cy="50" r="45" fill="#d90429"/><rect x="20" y="42" width="60" height="16" fill="#ffffff" rx="2"/></svg>`
  }
];
