/*
  Warnings:

  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] ADD [firstName] NVARCHAR(1000) NOT NULL,
[image] VARBINARY(max),
[lastName] NVARCHAR(1000) NOT NULL,
[phone] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[QrCode] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000) NOT NULL,
    [company] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [logoType] VARBINARY(max) NOT NULL,
    [image] VARBINARY(max) NOT NULL,
    [linkedIn] NVARCHAR(1000) NOT NULL,
    [x] NVARCHAR(1000) NOT NULL,
    [facebook] NVARCHAR(1000) NOT NULL,
    [instagram] NVARCHAR(1000) NOT NULL,
    [snapchat] NVARCHAR(1000) NOT NULL,
    [tiktok] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [customerId] BIGINT NOT NULL,
    [typeOfQrCodeId] INT NOT NULL,
    CONSTRAINT [QrCode_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [QrCode_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[typeOfQrCodeId] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [typeOfQrCodeId_pkey] PRIMARY KEY CLUSTERED ([id])
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
