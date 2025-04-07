-- ============================================
-- SCRIPT D'INSERTION DE DONNÉES FREEZBE
-- ============================================

-- === MODELES FREEZBE ===
DECLARE @IdModele1 INT;
INSERT INTO [KillerBee].[SCH_RD].[Modele] ([NomModele], [DescriptionModele], [PrixUHT], [Gamme], [DateCreation])
VALUES (N'Freezbe-AirScout', N'Drone de surveillance agricole avec capteurs multispectraux', 1899.0, N'AgriTech', GETDATE());
SET @IdModele1 = SCOPE_IDENTITY();

DECLARE @IdModele2 INT;
INSERT INTO [KillerBee].[SCH_RD].[Modele] ([NomModele], [DescriptionModele], [PrixUHT], [Gamme], [DateCreation])
VALUES (N'Freezbe-SprayX', N'Module de pulvérisation de précision pour traitements phytosanitaires', 1499.99, N'Module', GETDATE());
SET @IdModele2 = SCOPE_IDENTITY();

DECLARE @IdModele3 INT;
INSERT INTO [KillerBee].[SCH_RD].[Modele] ([NomModele], [DescriptionModele], [PrixUHT], [Gamme], [DateCreation])
VALUES (N'Freezbe-CargoDrop', N'Drone pour livraison de charges agricoles', 2299.9, N'Logistique', GETDATE());
SET @IdModele3 = SCOPE_IDENTITY();

-- === PROCEDES FREEZBE ===
DECLARE @IdProc1 INT;
INSERT INTO [KillerBee].[SCH_RD].[Procede] ([IdModele], [NomProcede], [DescriptionProcede], [ValidationTest], [Auteur], [DateCreation])
VALUES (@IdModele1, N'Calibration Capteurs', N'Ajustement des capteurs multispectraux', 1, N'Marion', GETDATE());
SET @IdProc1 = SCOPE_IDENTITY();

DECLARE @IdProc2 INT;
INSERT INTO [KillerBee].[SCH_RD].[Procede] ([IdModele], [NomProcede], [DescriptionProcede], [ValidationTest], [Auteur], [DateCreation])
VALUES (@IdModele2, N'Test de Pulvérisation', N'Évaluation de la couverture de pulvérisation', 1, N'Antoine', GETDATE());
SET @IdProc2 = SCOPE_IDENTITY();

DECLARE @IdProc3 INT;
INSERT INTO [KillerBee].[SCH_RD].[Procede] ([IdModele], [NomProcede], [DescriptionProcede], [ValidationTest], [Auteur], [DateCreation])
VALUES (@IdModele3, N'Épreuve de Charge', N'Test de vol avec charge maximale', 0, N'Julie', GETDATE());
SET @IdProc3 = SCOPE_IDENTITY();

-- === INGREDIENTS FREEZBE ===
DECLARE @IdIng1 INT;
INSERT INTO [KillerBee].[SCH_RD].[Ingredient] ([NomIngredient], [DescriptionIngredient])
VALUES (N'Solution Phytosanitaire A', N'Produit concentré pour traitement fongicide');
SET @IdIng1 = SCOPE_IDENTITY();

DECLARE @IdIng2 INT;
INSERT INTO [KillerBee].[SCH_RD].[Ingredient] ([NomIngredient], [DescriptionIngredient])
VALUES (N'Buse de Pulvérisation', N'Composant pour diffusion fine des liquides');
SET @IdIng2 = SCOPE_IDENTITY();

DECLARE @IdIng3 INT;
INSERT INTO [KillerBee].[SCH_RD].[Ingredient] ([NomIngredient], [DescriptionIngredient])
VALUES (N'Capteur Multispectral MX-200', N'Détection des cultures et stress hydrique');
SET @IdIng3 = SCOPE_IDENTITY();

DECLARE @IdIng4 INT;
INSERT INTO [KillerBee].[SCH_RD].[Ingredient] ([NomIngredient], [DescriptionIngredient])
VALUES (N'Conteneur Isolé 5L', N'Conteneur pour transport sécurisé');
SET @IdIng4 = SCOPE_IDENTITY();

DECLARE @IdIng5 INT;
INSERT INTO [KillerBee].[SCH_RD].[Ingredient] ([NomIngredient], [DescriptionIngredient])
VALUES (N'Batterie Haute Densité', N'Énergie longue durée pour missions prolongées');
SET @IdIng5 = SCOPE_IDENTITY();

-- === ETAPES FREEZBE ===
INSERT INTO [KillerBee].[SCH_RD].[Etape] ([IdProc], [DescriptionEtape], [NumEtape])
VALUES
(@IdProc1, N'Activation des capteurs', 1),
(@IdProc1, N'Recadrage spectral', 2),
(@IdProc2, N'Remplissage réservoir', 1),
(@IdProc2, N'Lancement de la pulvérisation', 2),
(@IdProc3, N'Chargement du conteneur', 1),
(@IdProc3, N'Test de montée verticale', 2);

-- === PROCEDES x INGREDIENTS FREEZBE ===
INSERT INTO [KillerBee].[SCH_RD].[ProcedeIngredient] ([IdProc], [IdIngredient], [Grammage])
VALUES
(@IdProc1, @IdIng3, 1.0),
(@IdProc2, @IdIng1, 0.8),
(@IdProc2, @IdIng2, 0.2),
(@IdProc3, @IdIng4, 3.0),
(@IdProc3, @IdIng5, 2.5);
