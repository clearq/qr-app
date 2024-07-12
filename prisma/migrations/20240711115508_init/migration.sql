BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Customer] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000),
    [password] NVARCHAR(1000) NOT NULL,
    [orgNumber] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [country] NVARCHAR(1000),
    [city] NVARCHAR(1000),
    [zip] NVARCHAR(1000),
    [company] NVARCHAR(1000),
    [image] NVARCHAR(max),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Customer_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [roleId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Customer_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Customer_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[VCard] (
    [id] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [tag] NVARCHAR(1000) NOT NULL,
    [customerEmail] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [company] NVARCHAR(1000),
    [title] NVARCHAR(1000),
    [logoType] NVARCHAR(max),
    [image] NVARCHAR(max),
    [linkedIn] NVARCHAR(1000),
    [x] NVARCHAR(1000),
    [facebook] NVARCHAR(1000),
    [instagram] NVARCHAR(1000),
    [snapchat] NVARCHAR(1000),
    [tiktok] NVARCHAR(1000),
    [url] NVARCHAR(1000),
    [customerId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [VCard_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [VCard_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Qr] (
    [id] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [tag] NVARCHAR(1000) NOT NULL,
    [logoType] NVARCHAR(max),
    [customerId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Qr_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Scan] (
    [id] NVARCHAR(1000) NOT NULL,
    [qrId] NVARCHAR(1000) NOT NULL,
    [ipAddress] NVARCHAR(1000) NOT NULL,
    [latitude] FLOAT(53) NOT NULL,
    [longitude] FLOAT(53) NOT NULL,
    [scannedAt] DATETIME2 NOT NULL CONSTRAINT [Scan_scannedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Scan_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Role_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Customer] ADD CONSTRAINT [Customer_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[VCard] ADD CONSTRAINT [VCard_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Qr] ADD CONSTRAINT [Qr_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Scan] ADD CONSTRAINT [Scan_qrId_fkey] FOREIGN KEY ([qrId]) REFERENCES [dbo].[Qr]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
