# System wspierania szpitala w rejestracji dokumentów cyfrowych

Projekt z Dokumentów Cyfrowych w Medycynie

### Testowe dane logowania:

- konto lekarza: login D10000 hasło doktor,
- konto laboranta: login L10000 hasło laborant,
- konto pacjenta: login P12345 hasło 123,
- konto pacjenta: login P11111 hasło abc)

#### Link do strony

https://mickanie.github.io/dokumenty_cyfrowe_w_medycynie/

#### Link do repozytorium z plikami serwera (Node.js)

https://github.com/Mickanie/medical-documentation-API

#### Link do hostingu plików serwara

https://medical-documentation.herokuapp.com

Loginy składają się z litery i 5 cyfr, P - pacjent, D - doktor, L - laborant

W panelu Lekarza należy podać ciąg 5 znaków, żeby zobaczyć dane o Pacjencie. Utworzone i wypełnione konta Pacjentów: P11111 i P12345

Podczas rejestracji hasło: 8-12 cyfr, ma zawierać duże i małe litery, cyfry i znaki specjalne.

##### Work in progress

Do zrobienia

- [x] logowanie
- [x] rejestracja z generacją loginu
- [x] pobieranie informacji z bazy
- [x] dodawanie nowych dokumentów i zadań do bazy
- [x] filtrowanie dokumentów po typie i po dacie
- [x] sortowanie dokumentów chronologicznie
- [x] wyróżnienie zaleceń zalogowanego lekarza
- [x] edycja zadań i danych pacjenta
- [x] raporty HTM badań laboratoryjnych
- [x] zagwarantowanie responsywności
- [ ] zagwarantowanie bezpieczeństwa
- [ ] połączenia między dokumentami (np. id zlecenia do wyników badań)

Baza danych

- [x] słownik laboratoryjny (zakresy i jednostki)
- [ ] dodawanie plików multimedialnych do bazy (IMG, PDF)
