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
    [company] NVARCHAR(1000),
    [image] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Customer_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
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
    [logoType] NVARCHAR(1000),
    [image] NVARCHAR(1000),
    [linkedIn] NVARCHAR(1000),
    [x] NVARCHAR(1000),
    [facebook] NVARCHAR(1000),
    [instagram] NVARCHAR(1000),
    [snapchat] NVARCHAR(1000),
    [tiktok] NVARCHAR(1000),
    [url] NVARCHAR(1000),
    [customerId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [VCard_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Qr] (
    [id] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [tag] NVARCHAR(1000) NOT NULL,
    [logoType] NVARCHAR(1000),
    [customerId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Qr_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[VCard] ADD CONSTRAINT [VCard_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Qr] ADD CONSTRAINT [Qr_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
