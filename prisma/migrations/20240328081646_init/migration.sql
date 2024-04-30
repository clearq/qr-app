/*
  Warnings:

  - You are about to drop the `typeOfQrCodeId` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] ALTER COLUMN [password] NVARCHAR(1000) NOT NULL;

-- DropTable
DROP TABLE [dbo].[typeOfQrCodeId];

-- CreateTable
CREATE TABLE [dbo].[TypeOfQrCodeId] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [TypeOfQrCodeId_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
