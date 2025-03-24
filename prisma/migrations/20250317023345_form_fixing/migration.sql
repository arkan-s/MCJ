/*
  Warnings:

  - You are about to drop the column `idPosition` on the `InvolvedPosition` table. All the data in the column will be lost.
  - Added the required column `personnelSubrea` to the `DataRiwayatKarir` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaPosition` to the `InvolvedPosition` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DataCareerPlan] ALTER COLUMN [positionShortTerm] VARCHAR(100) NULL;
ALTER TABLE [dbo].[DataCareerPlan] ALTER COLUMN [positionLongTerm] VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE [dbo].[DataRiwayatKarir] ALTER COLUMN [position] VARCHAR(100) NOT NULL;
ALTER TABLE [dbo].[DataRiwayatKarir] ADD [personnelSubrea] VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[InvolvedPosition] DROP COLUMN [idPosition];
ALTER TABLE [dbo].[InvolvedPosition] ADD [namaPosition] VARCHAR(100) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
