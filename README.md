# System wspierania szpitala w rejestracji dokumentów cyfrowych

## Projekt z Dokumentów Cyfrowych w Medycynie

Aplikacja internetowa w wersji desktop i mobile do przeglądania dokumentacji medycznej pacjentów, z możliwością edycji danych przez konto lekarza, dodawania dokumentów, zadań, zaleceń przez lekarza i wyników badań przez laboranta.

Technologie: React, Node.js, Express.js, Sass.

Baza danych: MongoDB (Atlas)

#### Testowe dane logowania:

- konto lekarza: login D10000 / D10001 hasło doktor,
- konto laboranta: login L10000 / L10001 hasło laborant,
- konto pacjenta: login P12345 hasło 123,
- konto pacjenta: login P11111 hasło abc.

#### Link do strony

https://mickanie.github.io/dokumenty_cyfrowe_w_medycynie/

#### Link do repozytorium z plikami serwera (Node.js)

https://github.com/Mickanie/medical-documentation-API

#### Link do hostingu plików serwara

https://medical-documentation.herokuapp.com

Loginy składają się z litery i 5 cyfr, P - pacjent, D - doktor, L - laborant

Podczas rejestracji hasło: 8-12 cyfr, ma zawierać duże i małe litery, cyfry i znaki specjalne.

##### Work in progress

Do zrobienia

- [x] logowanie
- [x] rejestracja z generacją loginu
- [x] pobieranie danych z bazy
- [x] dodawanie nowych dokumentów i zadań do bazy
- [x] filtrowanie dokumentów po typie i po dacie
- [x] sortowanie dokumentów chronologicznie
- [x] wyróżnienie zaleceń zalogowanego lekarza
- [x] edycja zadań i danych pacjenta
- [x] raporty HTML badań laboratoryjnych
- [x] zagwarantowanie responsywności
- [x] zagwarantowanie bezpieczeństwa (haszowanie haseł, wylogowanie i usuwanie wrażliwych danych po wyjściu z przeglądarki, wymaganie silnych haseł)
- [x] połączenia między dokumentami (id zlecenia do wyników badań)
- [x] połączenie zadań z poprzedzającymi i następującymi
- [x] widok procesu medycznego

Baza danych

- [x] słownik laboratoryjny (zakresy i jednostki)
- [x] dodawanie plików multimedialnych do chmury (Cloudinary)
