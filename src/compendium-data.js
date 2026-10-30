// compendium-data.js — Kompletne kompendium wiedzy do egzaminu na prawo jazdy (kat. B i pokrewne)

export const COMPENDIUM_CHAPTERS = [
  {
    id: "znaki",
    title: "Znaki Drogowe i Sygnały",
    icon: "🛑",
    description: "Znaki ostrzegawcze, zakazu, nakazu, informacyjne, tabliczki oraz sygnały świetlne.",
    sections: [
      {
        title: "Hierarchia ważności na drodze",
        badge: "Kluczowe na egzaminie",
        content: `
Zawsze obowiązuje ścisła hierarchia poleceń i sygnałów:
1. **Osoba kierująca ruchem** (policjant, żandarm wojskowy, strażak, osoba nadzorująca bezpieczne przejście dzieci) — jej polecenia mają **najwyższy priorytet**, uchylają sygnalizację, znaki i przepisy ogólne!
2. **Sygnalizacja świetlna** — ma pierwszeństwo przed znakami regulującymi pierwszeństwo (np. zielone światło unieważnia znak A-7 "ustąp pierwszeństwa" lub B-20 "STOP").
3. **Znaki drogowe** — znaki pionowe i poziome mają pierwszeństwo przed przepisami ogólnymi (np. regułą prawej ręki).
4. **Przepisy ogólne (tzw. reguła prawej ręki)** — obowiązują na skrzyżowaniach równorzędnych i wszędzie tam, gdzie pierwszeństwo nie zostało ustalone znakami ani sygnałami.
        `,
        tips: "Jeśli na skrzyżowaniu działa sprawna sygnalizacja świetlna, całkowicie ignorujesz znaki pierwszeństwa (A-7, D-1 itp.). Zwracasz na nie uwagę TYLKO wtedy, gdy światła są wyłączone lub miga żółte światło!"
      },
      {
        title: "Postawy policjanta kierującego ruchem",
        badge: "Częste pytania",
        content: `
- **Policjant stoi przodem lub tyłem do Twojego kierunku jazdy:** Odpowiednik **czerwonego światła**. Bezwzględny ZAKAZ wjazdu na skrzyżowanie!
- **Policjant stoi bokiem (profilem) do Ciebie:** Odpowiednik **zielonego światła**. Możesz wjechać na skrzyżowanie (skręt w lewo z ustąpieniem pierwszeństwa jadącym prosto z przeciwka).
- **Policjant podnosi rękę pionowo do góry:** Odpowiednik **żółtego światła**. Oznacza rychłą zmianę kierunku ruchu. Kierujący znajdujący się na skrzyżowaniu muszą je opuścić, inni nie mogą wjeżdżać, chyba że nie mogliby się zatrzymać bez gwałtownego hamowania.
- **Wyciągnięcie ręki poziomo poprzecznie do kierunku ruchu:** Zatrzymanie ruchu z tego kierunku.
        `,
        tips: "Mnemotechnika: Przód/tył = ściana (czerwone). Bok = brama otwarta (zielone)."
      },
      {
        title: "Znaki ostrzegawcze (A)",
        badge: "Grupa A",
        content: `
Ostrzegają o miejscach, w których występuje niebezpieczeństwo lub utrudnienia. Kształt: trójkąt z czerwoną obwódką i żółtym tłem.
- **Odległość umieszczenia znaku od miejsca niebezpiecznego:**
  - Na drogach o dopuszczalnej prędkości **powyżej 60 km/h** (poza obszarem zabudowanym): **150 m – 300 m**.
  - Na drogach o dopuszczalnej prędkości **do 60 km/h** (w obszarze zabudowanym): **do 100 m** (zazwyczaj 50-100 m, a dla A-7 może być bezpośrednio przy skrzyżowaniu).
- **Najważniejsze znaki:**
  - **A-7 (Ustąp pierwszeństwa):** Ostrzega o skrzyżowaniu z drogą z pierwszeństwem. Nie nakazuje bezwzględnego zatrzymania, chyba że sytuacja tego wymaga.
  - **A-1 do A-4:** Niebezpieczne zakręty. Za tymi znakami obowiązuje bezwzględny ZAKAZ wyprzedzania pojazdów silnikowych na zakrętach!
  - **A-6a do A-6e:** Skrzyżowanie z drogą podporządkowaną. Informuje, że znajdujesz się na drodze z pierwszeństwem.
  - **A-16 (Przejście dla pieszych):** Ostrzega o przejściu. Zakaz wyprzedzania na przejściu i bezpośrednio przed nim!
  - **A-29 (Sygnały świetlne):** Ostrzega o miejscu z sygnalizacją świetlną.
        `,
        tips: "Pamiętaj o różnicy odległości: 150-300m poza miastem vs do 100m w mieście!"
      },
      {
        title: "Znaki zakazu (B)",
        badge: "Grupa B",
        content: `
Kształt: okrągłe z czerwoną obwódką (wyjątki: B-20 STOP to ośmiokąt, B-39 strefa ograniczonego postoju to prostokąt).
- **Zasięg obowiązywania znaku zakazu:**
  - Znak obowiązuje od miejsca jego ustawienia do **najbliższego skrzyżowania** po tej samej stronie drogi.
  - Zakaz odwołują również znaki odwołujące (np. B-42 "koniec zakazów", B-34 "koniec ograniczenia prędkości").
  - **UWAGA — Co NIE odwołuje znaku zakazu:** Połączenie z drogą wewnętrzną, gruntową, dojazdową do posesji, strefą zamieszkania ani wyjazdem ze stacji benzynowej!
- **Kluczowe znaki zakazu:**
  - **B-20 (STOP):** Bezwzględny nakaz zatrzymania pojazdu w wyznaczonym miejscu (linia bezwzględnego zatrzymania P-12, a jeśli jej nie ma — w miejscu, z którego widać drogę z pierwszeństwem) oraz ustąpienia pierwszeństwa.
  - **B-25 (Zakaz wyprzedzania):** Zabrania wyprzedzania pojazdów silnikowych wielośladowych (samochodów, ciągników). Wolno wyprzedzić pojazd jednośladowy (rower, motocykl bez wózka) lub furmankę, o ile nie najeżdża się na linię ciągłą.
  - **B-35 (Zakaz postoju):** Postój to unieruchomienie powyżej 1 minuty (niewynikające z warunków ruchu). Zatrzymanie do 1 minuty jest dozwolone.
  - **B-36 (Zakaz zatrzymywania się):** Zabrania zarówno postoju, jak i każdego zatrzymania (nawet na ułamek sekundy).
        `,
        tips: "Znak B-20 STOP wymaga PEŁNEGO zatrzymania kół pojazdu (prędkość = 0 km/h). Toczenie się oznacza niezaliczenie egzaminu!"
      },
      {
        title: "Znaki nakazu (C) i informacyjne (D)",
        badge: "Grupy C i D",
        content: `
- **Znaki nakazu (C):** Okrągłe, niebieskie tło z białym symbolem. Wskazują obowiązkowy sposób jazdy (C-1 do C-11 kierunki jazdy, C-12 ruch okrężny, C-13 droga dla rowerów).
- **Znaki informacyjne (D):**
  - **D-1 (Droga z pierwszeństwem):** Oznacza początek lub kontynuację drogi z pierwszeństwem.
  - **D-3 (Droga jednokierunkowa):** Na tej drodze wolno parkować po obu stronach (jeśli znaki nie zabraniają), cofanie jest dozwolone (z zachowaniem szczególnej ostrożności), ale zawracanie jest BEZWZGLĘDNIE ZABRONIONE!
  - **D-40 (Strefa zamieszkania):** Prędkość max **20 km/h**. Pieszy ma bezwzględne pierwszeństwo w całej strefie (może iść środkiem jezdni). Dziecko do lat 7 może poruszać się samo bez opieki. Parkowanie dozwolone WYŁĄCZNIE w miejscach wyznaczonych. Wyjeżdżając ze strefy (D-41), włączasz się do ruchu i ustępujesz WSZYSTKIM!
  - **D-42 (Obszar zabudowany):** Prędkość max **50 km/h** całą dobę.
        `
      },
      {
        title: "Sygnały świetlne",
        badge: "S-1, S-2, S-3",
        content: `
- **Sygnalizator ogólny S-1:**
  - Zielone światło: wolno wjechać, ale przy skręcie w lewo trzeba ustąpić jadącym na wprost z przeciwka i pieszym na pasach.
  - Żółte światło: zakaz wjazdu, chyba że zatrzymanie wymagałoby gwałtownego hamowania grożącego niebezpieczeństwem.
  - Czerwone ze światłem żółtym: oznacza nadejście sygnału zielonego. Zakaz wjeżdżania!
- **Sygnalizator kierunkowy S-3:**
  - Posiada strzałki na kloszach. Gwarantuje **ruch bezkolizyjny**!
  - Jadąc w kierunku wskazanym przez zieloną strzałkę, masz pewność, że żaden strumień kolizyjny (pieszy, rowerzysta, pojazd z przeciwka) nie ma zielonego światła.
- **Sygnalizator S-2 (Zielona strzałka warunkowa w prawo):**
  - Przed skrętem masz **BEZWZGLĘDNY OBOWIĄZEK ZATRZYMANIA POJAZDU** przed sygnalizatorem (prędkość 0 km/h)!
  - Po zatrzymaniu i upewnieniu się, że nie utrudnisz ruchu pieszym i pojazdom mającym zielone światło, możesz warunkowo skręcić.
        `,
        tips: "Niezatrzymanie się przed zieloną strzałką warunkową S-2 to natychmiastowe przerwanie egzaminu państwowego!"
      }
    ]
  },
  {
    id: "skrzyzowania",
    title: "Skrzyżowania i Pierwszeństwo",
    icon: "🔄",
    description: "Reguła prawej ręki, ronda, tramwaje, pojazdy uprzywilejowane i korytarz życia.",
    sections: [
      {
        title: "Skrzyżowanie równorzędne (Reguła prawej ręki)",
        badge: "Podstawa ruchu",
        content: `
Na skrzyżowaniu równorzędnym (brak znaków określających pierwszeństwo lub sygnalizacji):
- Ustępujesz pierwszeństwa każdemu pojazdowi nadjeżdżającemu z **Twojej prawej strony**.
- Skręcając w lewo, ustępujesz także pojazdowi jadącemu z kierunku przeciwnego na wprost lub skręcającemu w prawo.
- **WYJĄTEK — Pojazd szynowy (tramwaj):** Na skrzyżowaniu równorzędnym tramwaj ma pierwszeństwo przed pojazdami nieszynowymi **zawsze**, zarówno gdy nadjeżdża z prawej, jak i z lewej strony!
- **Pojazdy uprzywilejowane:** Mają pierwszeństwo przed wszystkimi innymi uczestnikami ruchu.
        `
      },
      {
        title: "Tramwaje — 5 żelaznych zasad",
        badge: "Ulubione pytania WORD",
        content: `
1. **Sytuacja równorzędna:** Gdy tramwaj i samochód są w sytuacji równorzędnej (skrzyżowanie równorzędne LUB obaj mają znak "droga z pierwszeństwem" LUB obaj mają zielone światło ogólne) — **TRAMWAJ MA ZAWSZE PIERWSZEŃSTWO**!
2. **Tramwaj na znaku A-7 (Ustąp pierwszeństwa) lub B-20 (STOP):** Tramwaj **USTĘPUJE** pierwszeństwa pojazdom na drodze z pierwszeństwem!
3. **Tramwaj opuszczający rondo:** Tramwaj zjeżdżający ze skrzyżowania o ruchu okrężnym ma pierwszeństwo przed pojazdami poruszającymi się obok niego.
4. **Tramwaj wjeżdżający na rondo ze znakiem A-7:** Ustępuje pierwszeństwa pojazdom będącym już na rondzie!
5. **Wyjazd z pętli lub zajezdni:** Tramwaj włącza się do ruchu i **USTĘPUJE** pierwszeństwa wszystkim uczestnikom ruchu na drodze!
        `,
        tips: "Złota zasada: Tramwaj ustępuje TYLKO wtedy, gdy ma znak ustąp pierwszeństwa/STOP, gdy wjeżdża na rondo z A-7, albo gdy wyjeżdża z pętli/zajezdni/drogi wewnętrznej."
      },
      {
        title: "Rondo (Skrzyżowanie o ruchu okrężnym)",
        badge: "Przepisy i praktyka",
        content: `
- **Znak C-12 + A-7 (standard w Polsce):** Pojazd znajdujący się na rondzie ma bezwzględne pierwszeństwo przed pojazdem wjeżdżającym.
- **Samo C-12 bez znaku A-7 (bardzo rzadkie):** Obowiązuje reguła prawej ręki — pojazd wjeżdżający na rondo ma pierwszeństwo przed pojazdem na rondzie!
- **Kierunkowskazy na rondzie:**
  - **Przed wjazdem:** NIE włączamy lewego kierunkowskazu (zgodnie z orzecznictwem NSA).
  - **Na rondzie:** Lewego kierunkowskazu używamy TYLKO przy zmianie pasa na wewnętrzny na rondzie wielopasowym.
  - **Przy zjeździe:** ZAWSZE włączamy **prawy kierunkowskaz** tuż po minięciu zjazdu poprzedzającego ten, którym zamierzamy opuścić rondo.
- **Pasy ruchu:** Jeśli zjeżdżasz pierwszym zjazdem (w prawo) — zajmij prawy pas. Jeśli jedziesz prosto — prawy lub środkowy. Jeśli w lewo / zawracasz — lewy pas, a przed zjazdem zmień pas na prawy ustępując pojazdom na pasie zewnętrznym.
        `
      },
      {
        title: "Korytarz życia i jazda na suwak",
        badge: "Obowiązek ustawowy",
        content: `
- **Korytarz życia (art. 9a PoRD):**
  - Obowiązuje w razie zatoru na drodze o co najmniej dwóch pasach w jednym kierunku, gdy zbliża się pojazd uprzywilejowany.
  - **Kierowcy na skrajnym LEWYM pasie:** zjeżdżają maksymalnie do **LEWEJ** krawędzi jezdni.
  - **Kierowcy na WSZYSTKICH POZOSTAŁYCH pasach (środkowym, prawym):** zjeżdżają maksymalnie do **PRAWEJ** krawędzi jezdni.
  - Pasem awaryjnym lub utworzonym korytarzem wolno poruszać się WYŁĄCZNIE pojazdom uprzywilejowanym oraz służbom ratunkowym i zarządcy drogi!
- **Jazda na suwak (art. 22 ust. 4a PoRD):**
  - Obowiązuje, gdy na jezdni o min. 2 pasach występuje **znaczne zmniejszenie prędkości (zator/korek)** i jeden z pasów zanika lub jest zablokowany.
  - Kierowca na pasie mającym kontynuację ma **OBOWIĄZEK wpuścić JEDEN pojazd** z pasa zanikającego bezpośrednio przed miejscem zwężenia.
  - Pojazd wpuszczany musi dojechać do samego końca kończącego się pasa!
        `,
        tips: "Jazda na suwak NIE obowiązuje przy płynnym ruchu ani przy włączaniu się do ruchu (np. z pasa rozbiegowego na autostradzie)!"
      }
    ]
  },
  {
    id: "predkosci",
    title: "Prędkości, Odstępy i Manewry",
    icon: "⚡",
    description: "Tabela dopuszczalnych prędkości, minimalne odstępy, wyprzedzanie i zatrzymanie.",
    sections: [
      {
        title: "Tabela dopuszczalnych prędkości w Polsce (Samochód osobowy)",
        badge: "Koniecznie zapamiętaj",
        content: `
| Rodzaj drogi / obszaru | Dopuszczalna prędkość (osobowe do 3.5 t) | Z przyczepą / pow. 3.5 t |
|---|---|---|
| **Strefa zamieszkania** | **20 km/h** | 20 km/h |
| **Obszar zabudowany** | **50 km/h** (całą dobę!) | 50 km/h |
| **Poza obszarem: droga 1-jezdniowa dwukierunkowa** | **90 km/h** | 70 km/h |
| **Poza obszarem: droga 2-jezdniowa dwukierunkowa** | **100 km/h** | 80 km/h |
| **Droga ekspresowa 1-jezdniowa** | **100 km/h** | 80 km/h |
| **Droga ekspresowa 2-jezdniowa** | **120 km/h** | 80 km/h |
| **Autostrada** | **140 km/h** | 80 km/h |
| **Holowanie w obszarze zabudowanym** | **30 km/h** | - |
| **Holowanie poza obszarem zabudowanym** | **60 km/h** | - |
        `,
        tips: "Pamiętaj: 50 km/h obowiązuje CAŁĄ DOBĘ (dawny limit 60 km/h w nocy został zlikwidowany)!"
      },
      {
        title: "Bezpieczny odstęp na autostradzie i drodze ekspresowej",
        badge: "Reguła połowy prędkości",
        content: `
Kierujący pojazdem na autostradzie i drodze ekspresowej jest obowiązany zachować odstęp od poprzedzającego pojazdu wynoszący **co najmniej połowę aktualnej prędkości wyrażoną w metrach**.
- Przy prędkości **100 km/h** -> min. **50 metrów**.
- Przy prędkości **120 km/h** -> min. **60 metrów**.
- Przy prędkości **140 km/h** -> min. **70 metrów**.
Wyjątek: odstęp ten może być mniejszy wyłącznie podczas wykonywania manewru wyprzedzania.
        `
      },
      {
        title: "Wyprzedzanie — Bezwzględne zakazy",
        badge: "Bezpieczeństwo",
        content: `
Zabrania się wyprzedzania pojazdu silnikowego jadącego po jezdni:
1. **Przy dojeżdżaniu do wierzchołka wzniesienia.**
2. **Na zakrętach oznaczonych znakami ostrzegawczymi.**
3. **Na skrzyżowaniu**, z wyjątkiem:
   - skrzyżowania o ruchu okrężnym,
   - skrzyżowania, na którym ruch jest kierowany sygnalizacją świetlną,
   - wyprzedzania z prawej strony pojazdu sygnalizującego zamiar skrętu w lewo.
4. **Na przejściu dla pieszych i bezpośrednio przed nim** (z wyjątkiem przejść z sygnalizacją świetlną).
5. **Na przejeździe kolejowym i tramwajowym oraz bezpośrednio przed nimi.**
- **Wyprzedzanie z prawej strony:** Dozwolone na jezdni jednokierunkowej z wyznaczonymi pasami ruchu oraz na jezdni dwukierunkowej w obszarze zabudowanym (min. 2 pasy w jednym kierunku) lub poza obszarem (min. 3 pasy w jednym kierunku).
- **Minimalny odstęp przy wyprzedzaniu:** Przy wyprzedzaniu roweru, wózka rowerowego, motoroweru, motocykla lub kolumny pieszych musisz zachować odstęp co najmniej **1 METR**!
        `
      },
      {
        title: "Zatrzymanie i Postój — Wymiary i odległości",
        badge: "Pomiary w metrach",
        content: `
- **Zatrzymanie:** do 1 minuty (lub wynikające z warunków ruchu).
- **Postój:** powyżej 1 minuty (nie wynika z warunków ruchu).
- **Gdzie nie wolno się zatrzymać:**
  - W odległości mniejszej niż **10 m od przedniej strony znaku lub sygnału drogowego**, jeśli pojazd by je zasłonił.
  - W odległości mniejszej niż **10 m od przejazdu kolejowego lub tramwajowego oraz skrzyżowania**.
  - W odległości mniejszej niż **10 m od przejścia dla pieszych lub przejazdu dla rowerzystów** (oraz za przejściem na jezdni dwukierunkowej o jednym pasie w każdym kierunku).
  - W odległości mniejszej niż **15 m od słupka lub tablicy oznaczającej przystanek** (lub na całej długości zatoki).
  - W odległości mniejszej niż **15 m od punktów krańcowych wysepki**, jeżeli jezdnia ma z prawej strony tylko jeden pas.
- **Chodnik:** Zatrzymanie na chodniku kołami jednego boku lub przedniej osi jest dozwolone, jeśli masa pojazdu nie przekracza 2.5 t, a dla pieszych pozostaje **co najmniej 1.5 m** szerokości chodnika!
        `
      }
    ]
  },
  {
    id: "przepisy",
    title: "Prawo, Alkohol i Punkty Karne",
    icon: "⚖️",
    description: "Limity alkoholu, przestępstwa drogowe, taryfikator punktów karnych i uprawnienia.",
    sections: [
      {
        title: "Stan po użyciu alkoholu vs Stan nietrzeźwości",
        badge: "Bardzo ważne",
        content: `
W Polsce obowiązują rygorystyczne przepisy dotyczące alkoholu:
- **Stan trzeźwości:** do 0,19‰ we krwi (do 0,09 mg/dm³ w wydychanym powietrzu).
- **STAN PO UŻYCIU ALKOHOLU (Wykroczenie):**
  - Stężenie od **0,2‰ do 0,5‰** we krwi (lub od **0,1 mg/dm³ do 0,25 mg/dm³** w wydychanym powietrzu).
  - Skutki: Areszt lub grzywna do 30 000 zł, zakaz prowadzenia pojazdów od 6 miesięcy do 3 lat, **15 punktów karnych**.
- **STAN NIETRZEŹWOŚCI (Przestępstwo — art. 178a Kodeksu Karnego):**
  - Stężenie **powyżej 0,5‰** we krwi (lub **powyżej 0,25 mg/dm³** w wydychanym powietrzu).
  - Skutki: Kara pozbawienia wolności do 3 lat, zakaz prowadzenia od 3 do 15 lat, świadczenie pieniężne na Fundusz Pomocy Pokrzywdzonym min. **5 000 zł** (przy recydywie min. 10 000 zł), konfiskata pojazdu w określonych przypadkach!
        `,
        tips: "Zapamiętaj granice: 0.2‰ (0.1 mg) to początek wykroczenia; 0.5‰ (0.25 mg) to granica przestępstwa!"
      },
      {
        title: "Punkty karne i okres próbny",
        badge: "Taryfikator",
        content: `
- **Limit punktów karnych:**
  - Standardowy kierowca: **24 punkty**.
  - Młody kierowca (w 1. roku od wydania pierwszego prawa jazdy): **20 punktów**.
- **Kasowanie punktów:** Punkty kasują się automatycznie po upływie **1 ROKU od daty OPŁACENIA mandatu** (nie od dnia popełnienia wykroczenia!).
- **Maksymalna jednorazowa liczba punktów:** Za najcięższe wykroczenia (np. nieustąpienie pieszemu na pasach, wyprzedzanie na pasach, ucieczka przed policją, >50 km/h w zabudowanym) kierowca otrzymuje **15 punktów karnych**!
        `
      },
      {
        title: "Kategoria B — Jakimi pojazdami wolno kierować?",
        badge: "Uprawnienia kat. B",
        content: `
Posiadając prawo jazdy kategorii B masz prawo kierować:
1. Samochodem o dopuszczalnej masie całkowitej (DMC) **do 3,5 tony** (z wyjątkiem autobusu i motocykla), konstrukcyjnie przeznaczonym do przewozu max **9 osób** łącznie z kierowcą.
2. Zestawem: pojazd z pkt 1 z **przyczepą lekką** (DMC przyczepy do 750 kg) — łączna DMC zestawu może wynosić do **4,25 tony**.
3. Zestawem: pojazd z pkt 1 z przyczepą inną niż lekka, o ile łączna DMC zespołu pojazdów nie przekracza **3,5 tony**.
4. Pojazdami określonymi dla kategorii **AM** (mopedy, motorowery, czterokołowce lekkie).
5. Ciągnikiem rolniczym i pojazdem wolnobieżnym (również z przyczepą lekką).
6. **Motocyklem o pojemności do 125 cm³** (moc do 11 kW, stosunek mocy do masy do 0,1 kW/kg) — pod warunkiem posiadania prawa jazdy kat. B od **co najmniej 3 lat**!
        `
      }
    ]
  },
  {
    id: "pojazd",
    title: "Pojazd, Światła i Stan Techniczny",
    icon: "🚗",
    description: "Obowiązkowe wyposażenie, oświetlenie, bieżnik opon, trójkąt ostrzegawczy i płyny.",
    sections: [
      {
        title: "Obowiązkowe wyposażenie samochodu w Polsce",
        badge: "Wymóg prawny",
        content: `
W Polsce w samochodzie osobowym obowiązkowe są tylko dwa elementy wyposażenia:
1. **Gaśnica ABC** — sprawna, o pojemności co najmniej 1 kg, umieszczona w miejscu łatwo dostępnym.
2. **Trójkąt ostrzegawczy** — posiadający homologację (znak zgodności).
- **Apteczka i kamizelka odblaskowa:** Nie są obowiązkowym wyposażeniem samego pojazdu osobowego wg PoRD, ALE kamizelka jest wymagana dla każdej osoby wychodzącej z auta po zmroku poza terenem zabudowanym!
        `
      },
      {
        title: "Rozstawianie trójkąta ostrzegawczego",
        badge: "Wymiary w metrach",
        content: `
W razie awarii lub wypadku trójkąt ostrzegawczy umieszcza się w odległości:
- **Autostrada i droga ekspresowa:** w odległości **100 METRÓW** za pojazdem (włączone światła awaryjne).
- **Poza obszarem zabudowanym (zwykła droga):** w odległości **30 – 50 METRÓW** za pojazdem.
- **W obszarze zabudowanym:** bezpośrednio **ZA pojazdem lub NA nim** (na wysokości nie większej niż 1 metr).
        `,
        tips: "Pamiętaj: 100m na autostradzie, 30-50m poza miastem, za/na pojeździe w mieście!"
      },
      {
        title: "Światła w pojeździe — Zasady używania",
        badge: "Oświetlenie",
        content: `
- **Światła do jazdy dziennej:** Wolno używać od świtu do zmierzchu w warunkach normalnej przejrzystości powietrza.
- **Światła mijania (krótkie):** Obowiązkowe od zmierzchu do świtu, w tunelu oraz w warunkach zmniejszonej przejrzystości powietrza (deszcz, mgła, śnieg).
- **Światła drogowe (długie):** Wolno używać od zmierzchu do świtu na nieoświetlonych drogach, pod warunkiem nieoślepiania innych kierujących ani pieszych w kolumnie. Masz obowiązek przełączyć na mijania w razie zbliżania się pojazdu z naprzeciwka lub poprzedzającego!
- **Tylne światła przeciwmgłowe:** Wolno włączyć **WYŁĄCZNIE wtedy, gdy widoczność spadnie poniżej 50 METRÓW**! W razie poprawy widoczności należy je natychmiast wyłączyć.
        `
      },
      {
        title: "Stan techniczny opon i hamulców",
        badge: "Eksploatacja",
        content: `
- **Minimalna dopuszczalna głębokość bieżnika:** **1,6 mm** lub do wskaźnika zużycia **TWI** (Tread Wear Indicator).
- **Opony na jednej osi:** Na kołach tej samej osi muszą być zamontowane opony o identycznej konstrukcji, rzeźbie bieżnika i stopniu zużycia.
- **Płyn hamulcowy:** Jest higroskopijny (chłonie wodę z otoczenia), co obniża jego temperaturę wrzenia i może doprowadzić do całkowitej utraty hamulców. Wymaga wymiany zazwyczaj co 2 lata.
        `
      }
    ]
  },
  {
    id: "pomoc",
    title: "Pierwsza Pomoc Przedmedyczna (BLS)",
    icon: "🩺",
    description: "Resuscytacja krążeniowo-oddechowa (RKO), AED, pozycja boczna ustalona i telefony ratunkowe.",
    sections: [
      {
        title: "Algorytm postępowania ratowniczego",
        badge: "Ratowanie życia",
        content: `
1. **Bezpieczeństwo:** Zadbaj o bezpieczeństwo własne, świadków i poszkodowanego (kamizelka odblaskowa, rękawiczki, trójkąt ostrzegawczy, wyłączenie stacyjki).
2. **Ocena przytomności:** Podejdź od strony głowy, potrząśnij delikatnie za ramiona i głośno zapytaj: *"Czy pan/pani mnie słyszy? Co się stało?"*.
3. **Jeśli reaguje:** Pozostaw w zastanej pozycji, dowiedz się co się stało, wezwij pomoc w razie potrzeby, regularnie oceniaj stan.
4. **Jeśli NIE reaguje (nieprzytomny):**
   - Zawołaj o pomoc osoby postronne: *"Pomocy, niech ktoś tu podejdzie!"*.
   - **Udrożnij drogi oddechowe:** Połóż jedną rękę na czole poszkodowanego, opuszki palców drugiej ręki na żuchwie i delikatnie odchyl głowę do tyłu.
   - **Oceń oddech przez dokładnie 10 SEKUND:**
     - Wzrokiem (obserwuj unoszenie klatki piersiowej),
     - Słuchem (szmer wydychanego powietrza przy ustach),
     - Dotykiem (ciepło oddechu na swoim policzku).
     - Prawidłowy oddech to **minimum 2 prawidłowe oddechy** w ciągu 10 sekund!
        `
      },
      {
        title: "RKO — Resuscytacja Krążeniowo-Oddechowa",
        badge: "30 : 2",
        content: `
Gdy poszkodowany **nie oddycha prawidłowo lub ma oddech agonalny (pojedyncze westchnięcia)**:
1. Zadzwoń pod numer **112** lub **999** (lub wyznacz konkretną osobę: *"Pan w niebieskiej kurtce dzwoni pod 112 i przynosi defibrylator AED"*).
2. Rozpocznij uciśnięcia klatki piersiowej:
   - Połóż splecione dłonie na **środku klatki piersiowej** (dolna połowa mostka).
   - Ramiona wyprostowane, prostopadle do klatki piersiowej.
   - Wykonaj **30 UCIŚNIĘĆ** na głębokość **5–6 cm** w tempie **100–120 uciśnięć na minutę** (np. rytm utworu "Stayin' Alive").
3. Wykonaj **2 ODDECHY RATOWNICZE**:
   - Zaciśnij skrzydełka nosa poszkodowanego, obejmij swoimi ustami jego usta i spokojnie wdmuchuj powietrze przez ok. 1 sekundę, obserwując unoszenie się klatki piersiowej.
4. Kontynuuj cykl **30 uciśnięć : 2 oddechy** bez przerw do momentu:
   - Przybycia zespołu ratownictwa medycznego i przejęcia poszkodowanego,
   - Odzyskania przez poszkodowanego oznak życia (otwarcie oczu, ruch, prawidłowy oddech),
   - Całkowitego wyczerpania sił ratownika.
        `,
        tips: "U dzieci (od 1 roku do pokwitania) i niemowląt: Zaczynamy od 5 ODDECHÓW WSTĘPNYCH, a dopiero potem uciskanie w proporcji 15:2 (lub 30:2)!"
      },
      {
        title: "Automatyczny Defibrylator Zewnętrzny (AED)",
        badge: "AED",
        content: `
- Urządzenie jest w pełni bezpieczne i prowadzi ratownika **komendami głosowymi i wizualnymi w języku polskim**.
- Po włączeniu AED natychmiast naklej elektrody na odsłoniętą klatkę piersiową zgodnie z rysunkiem na elektrodach (jedna pod prawym obojczykiem, druga pod lewą pachą).
- Podczas analizy rytmu serca oraz przed defibrylacją upewnij się, że **NIKT NIE DOTYKA POSZKODOWANEGO**!
- Natychmiast po wyładowaniu kontynuuj RKO (30:2), jeśli AED tak zaleci.
        `
      },
      {
        title: "Pozycja bezpieczna (boczna ustalona)",
        badge: "Nieprzytomny oddychający",
        content: `
Stosowana u osoby **nieprzytomnej, która ODDYCHA PRAWIDŁOWO** i u której nie ma podejrzenia urazu kręgosłupa:
- Zapewnia drożność dróg oddechowych i zapobiega zadławieniu się językiem lub wymiocinami.
- Rękę bliższą ułóż pod kątem prostym, dalszą dłoń przyłóż grzbietem do policzka, zegnij dalszą nogę w kolanie i pociągnij za kolano, obracając poszkodowanego na bok.
- Regularnie (co minutę) kontroluj oddech aż do przyjazdu pogotowia ratunkowego!
        `
      }
    ]
  }
];
