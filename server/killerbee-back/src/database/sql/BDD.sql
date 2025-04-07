-- Création de la base de données KillerBee
IF DB_ID('KillerBee') IS NOT NULL
    DROP DATABASE KillerBee;
GO

CREATE DATABASE KillerBee;
GO

USE KillerBee;
GO

-- Création des schémas
CREATE SCHEMA SCH_RD;
GO
GO
CREATE SCHEMA SCH_PROD;
GO

-- SCH_RD : Données créées par la R&D
CREATE TABLE SCH_RD.Modele (
    IdModele INT IDENTITY(1,1) PRIMARY KEY,
    NomModele NVARCHAR(100),
    DescriptionModele NVARCHAR(MAX),
    PrixUHT DECIMAL(10,2),
    Gamme NVARCHAR(50),
	DateCreation DATETIME
);

CREATE TABLE SCH_RD.Ingredient (
    IdIngredient INT IDENTITY(1,1) PRIMARY KEY,
    NomIngredient NVARCHAR(100),
    DescriptionIngredient NVARCHAR(MAX)
);

CREATE TABLE SCH_RD.Procede (
    IdProc INT IDENTITY(1,1) PRIMARY KEY,
    IdModele INT,
    NomProcede NVARCHAR(100),
    DescriptionProcede NVARCHAR(MAX),
    ValidationTest BIT,
    Auteur NVARCHAR(100),
    DateCreation DATETIME,
    FOREIGN KEY (IdModele) REFERENCES SCH_RD.Modele(IdModele)
);

CREATE TABLE SCH_RD.Etape (
    IdEtape INT IDENTITY(1,1) PRIMARY KEY,
    IdProc INT,
    DescriptionEtape NVARCHAR(MAX),
    NumEtape INT,
    FOREIGN KEY (IdProc) REFERENCES SCH_RD.Procede(IdProc)
);

-- SCH_PROD : Données validées
CREATE TABLE SCH_PROD.Modele (
    IdModele INT IDENTITY(1,1) PRIMARY KEY,
    NomModele NVARCHAR(100),
    DescriptionModele NVARCHAR(MAX),
    PrixUHT DECIMAL(10,2),
    Gamme NVARCHAR(50),
	DateCreation DATETIME
);

-- Nouvelle table de liaison : ModeleIngredient
CREATE TABLE SCH_PROD.Ingredient (
    IdIngredient INT IDENTITY(1,1) PRIMARY KEY,
    NomIngredient NVARCHAR(100),
    DescriptionIngredient NVARCHAR(MAX)
);

CREATE TABLE SCH_PROD.Procede (
    IdProc INT IDENTITY(1,1) PRIMARY KEY,
    IdModele INT,
    NomProcede NVARCHAR(100),
    DescriptionProcede NVARCHAR(MAX),
    FOREIGN KEY (IdModele) REFERENCES SCH_PROD.Modele(IdModele)
);

CREATE TABLE SCH_PROD.Etape (
    IdEtape INT IDENTITY(1,1) PRIMARY KEY,
    IdProc INT,
    DescriptionEtape NVARCHAR(MAX),
    NumEtape INT,
    FOREIGN KEY (IdProc) REFERENCES SCH_PROD.Procede(IdProc)
);

-- Table des utilisateurs
CREATE TABLE Utilisateur (
    IdUser INT IDENTITY(1,1) PRIMARY KEY,
    NomUser NVARCHAR(100),
    PrenomUser NVARCHAR(100),
    EmailUser NVARCHAR(100),
	PassWordUser NVARCHAR(100),
    LastConnexion DATETIME,
    DateCreation DATETIME,
    RoleUtilisateur NVARCHAR(50),
    refreshToken NVARCHAR(100),
);

-- Création des rôles
CREATE ROLE RD_ROLE;
CREATE ROLE TEST_ROLE;
CREATE ROLE PROD_ROLE;
CREATE ROLE USER_ROLE;

-- Permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::SCH_RD TO RD_ROLE;
GRANT SELECT ON SCHEMA::SCH_RD TO TEST_ROLE;
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::SCH_PROD TO PROD_ROLE;

-- Nouvelle table de liaison : ProcedeIngredient
CREATE TABLE SCH_RD.ProcedeIngredient (
    IdProc INT,
    IdIngredient INT,
    Grammage INT,
    PRIMARY KEY (IdProc, IdIngredient),
    FOREIGN KEY (IdProc) REFERENCES SCH_RD.Procede(IdProc),
    FOREIGN KEY (IdIngredient) REFERENCES SCH_RD.Ingredient(IdIngredient)
);

CREATE TABLE SCH_PROD.ProcedeIngredient (
    IdProc INT,
    IdIngredient INT,
    Grammage INT,
    PRIMARY KEY (IdProc, IdIngredient),
    FOREIGN KEY (IdProc) REFERENCES SCH_PROD.Procede(IdProc),
    FOREIGN KEY (IdIngredient) REFERENCES SCH_PROD.Ingredient(IdIngredient)
);

-- Vues pour permettre à PROD de voir les tests validés

GO
CREATE PROCEDURE MettreEnProduction
    @IdProc INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Vérifier que le procédé existe
        IF NOT EXISTS (
            SELECT 1 FROM SCH_RD.Procede WHERE IdProc = @IdProc
        )
        BEGIN
            RAISERROR('Le procédé spécifié n''existe pas.', 16, 1);
            RETURN;
        END

        -- Vérifier que le procédé est validé
        IF NOT EXISTS (
            SELECT 1 FROM SCH_RD.Procede WHERE IdProc = @IdProc AND ValidationTest = 1
        )
        BEGIN
            RAISERROR('Le procédé n''est pas validé.', 16, 1);
            RETURN;
        END

        DECLARE @IdModele INT;
        SELECT @IdModele = IdModele FROM SCH_RD.Procede WHERE IdProc = @IdProc;

        ------------------------------------------
        -- 1. Copier le modèle s’il n’existe pas
        ------------------------------------------
        IF NOT EXISTS (
            SELECT 1 FROM SCH_PROD.Modele WHERE IdModele = @IdModele
        )
        BEGIN
            SET IDENTITY_INSERT SCH_PROD.Modele ON;

            INSERT INTO SCH_PROD.Modele (IdModele, NomModele, DescriptionModele, PrixUHT, Gamme, DateCreation)
            SELECT IdModele, NomModele, DescriptionModele, PrixUHT, Gamme, DateCreation
            FROM SCH_RD.Modele
            WHERE IdModele = @IdModele;

            SET IDENTITY_INSERT SCH_PROD.Modele OFF;
        END

        ------------------------------------------
        -- 2. Copier le procédé AVANT les liaisons
        ------------------------------------------
        IF NOT EXISTS (
            SELECT 1 FROM SCH_PROD.Procede WHERE IdProc = @IdProc
        )
        BEGIN
            SET IDENTITY_INSERT SCH_PROD.Procede ON;

            INSERT INTO SCH_PROD.Procede (IdProc, IdModele, NomProcede, DescriptionProcede)
            SELECT IdProc, IdModele, NomProcede, DescriptionProcede
            FROM SCH_RD.Procede
            WHERE IdProc = @IdProc;

            SET IDENTITY_INSERT SCH_PROD.Procede OFF;
        END

        ------------------------------------------
        -- 3. Copier les ingrédients liés au procédé
        ------------------------------------------
        SET IDENTITY_INSERT SCH_PROD.Ingredient ON;

        INSERT INTO SCH_PROD.Ingredient (IdIngredient, NomIngredient, DescriptionIngredient)
        SELECT DISTINCT i.IdIngredient, i.NomIngredient, i.DescriptionIngredient
        FROM SCH_RD.Ingredient i
        INNER JOIN SCH_RD.ProcedeIngredient pi ON pi.IdIngredient = i.IdIngredient
        WHERE pi.IdProc = @IdProc
        AND NOT EXISTS (
            SELECT 1 FROM SCH_PROD.Ingredient ip WHERE ip.IdIngredient = i.IdIngredient
        );

        SET IDENTITY_INSERT SCH_PROD.Ingredient OFF;

        ------------------------------------------
        -- 4. Copier la table de liaison procédé-ingrédient
        ------------------------------------------
        INSERT INTO SCH_PROD.ProcedeIngredient (IdProc, IdIngredient, Grammage)
        SELECT IdProc, IdIngredient, Grammage
        FROM SCH_RD.ProcedeIngredient
        WHERE IdProc = @IdProc
        AND NOT EXISTS (
            SELECT 1 FROM SCH_PROD.ProcedeIngredient pi
            WHERE pi.IdProc = SCH_RD.ProcedeIngredient.IdProc
              AND pi.IdIngredient = SCH_RD.ProcedeIngredient.IdIngredient
        );

        ------------------------------------------
        -- 5. Copier les étapes
        ------------------------------------------
        SET IDENTITY_INSERT SCH_PROD.Etape ON;

        INSERT INTO SCH_PROD.Etape (IdEtape, IdProc, DescriptionEtape, NumEtape)
        SELECT e.IdEtape, e.IdProc, e.DescriptionEtape, e.NumEtape
        FROM SCH_RD.Etape e
        WHERE e.IdProc = @IdProc
        AND NOT EXISTS (
            SELECT 1 FROM SCH_PROD.Etape ep WHERE ep.IdEtape = e.IdEtape
        );

        SET IDENTITY_INSERT SCH_PROD.Etape OFF;

    END TRY
    BEGIN CATCH
        DECLARE @ErrMsg NVARCHAR(MAX) = ERROR_MESSAGE();
        RAISERROR('Erreur MettreEnProduction : %s', 16, 1, @ErrMsg);
    END CATCH
END;
GO
