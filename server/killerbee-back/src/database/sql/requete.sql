INSERT INTO Utilisateur (NomUser, PrenomUser, EmailUser, PassWordUser, DateCreation, RoleUtilisateur)
VALUES ('Dev', 'Simu', 'dev@killerbee.local', NULL, GETDATE(), 'ADMIN');

-- test
-- POST /auth/login
{
  "username": "dev",
  "password": "test"
}

-- POST /rd/modele
{
  "IdModele": 1,
  "NomModele": "TestX",
  "DescriptionModele": "Prototype test",
  "PrixUHT": 120.5,
  "Gamme": "A",
  "DateCreation": "2025-03-29"
}

-- POST /rd/procede
{
  "IdProc": 10,
  "IdModele": 1,
  "NomProcede": "Procédé A",
  "DescriptionProcede": "Phase test",
  "ValidationTest": false,
  "Auteur": "dev",
  "DateCreation": "2025-03-29"
}

-- POST /rd/procede/10/etapes
{
  "DescriptionEtape": "Test mécanique",
  "NumEtape": 1
}
