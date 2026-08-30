CREATE TABLE Libri(
    isbn CHAR(13) PRIMARY KEY,
    titolo VARCHAR(300) NOT NULL,
    trama TEXT NOT NULL,
    immagine VARCHAR(500) NOT NULL,
    quantita_disponibile INT NOT NULL
);

CREATE TABLE Utenti(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL,
    ruolo VARCHAR(50) NOT NULL
);