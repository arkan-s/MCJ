/*
  Warnings:

  - You are about to drop the column `personnelSubrea` on the `DataRiwayatKarir` table. All the data in the column will be lost.
  - Added the required column `personnelSubarea` to the `DataRiwayatKarir` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DataRiwayatKarir] DROP COLUMN [personnelSubrea];
ALTER TABLE [dbo].[DataRiwayatKarir] ADD [personnelSubarea] VARCHAR(10) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
