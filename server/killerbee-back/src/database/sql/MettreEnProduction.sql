GO
CREATE OR ALTER PROCEDURE MettreEnProduction
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
