BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [password] VARCHAR(max) NOT NULL,
    [role] VARCHAR(10) NOT NULL,
    [isFirstLogin] BIT NOT NULL,
    [name] NVARCHAR(1000),
    [username] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [emailVerified] DATETIME2,
    [image] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_nomorIndukKaryawan_key] UNIQUE NONCLUSTERED ([nomorIndukKaryawan])
);

-- CreateTable
CREATE TABLE [dbo].[Account] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [provider] NVARCHAR(1000) NOT NULL,
    [providerAccountId] NVARCHAR(1000) NOT NULL,
    [refresh_token] TEXT,
    [access_token] TEXT,
    [expires_at] INT,
    [token_type] NVARCHAR(1000),
    [scope] NVARCHAR(1000),
    [id_token] TEXT,
    [session_state] NVARCHAR(1000),
    [refresh_token_expires_in] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Account_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Account_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Account_provider_providerAccountId_key] UNIQUE NONCLUSTERED ([provider],[providerAccountId])
);

-- CreateTable
CREATE TABLE [dbo].[DataBranch] (
    [idBranch] VARCHAR(10) NOT NULL,
    [namaBranch] VARCHAR(100) NOT NULL,
    [alamat] VARCHAR(max),
    CONSTRAINT [PK_DataBranch] PRIMARY KEY CLUSTERED ([idBranch])
);

-- CreateTable
CREATE TABLE [dbo].[DataCareerPlan] (
    [idCareerPlan] VARCHAR(10) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [positionShortTerm] VARCHAR(10),
    [positionLongTerm] VARCHAR(10),
    CONSTRAINT [PK_DataCareerPlan] PRIMARY KEY CLUSTERED ([idCareerPlan])
);

-- CreateTable
CREATE TABLE [dbo].[DataDepartment] (
    [idDepartment] VARCHAR(10) NOT NULL,
    [namaDepartment] VARCHAR(100) NOT NULL,
    CONSTRAINT [PK_DataDepartment] PRIMARY KEY CLUSTERED ([idDepartment])
);

-- CreateTable
CREATE TABLE [dbo].[DataKaryawan] (
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [namaKaryawan] VARCHAR(100) NOT NULL,
    [tanggalLahir] DATE NOT NULL,
    [tanggalMasukKerja] DATE NOT NULL,
    [gender] VARCHAR(10) NOT NULL,
    [personnelArea] VARCHAR(10) NOT NULL,
    [position] VARCHAR(100) NOT NULL,
    [personnelSubarea] VARCHAR(10) NOT NULL,
    [levelPosition] VARCHAR(10) NOT NULL,
    [age] FLOAT(53) NOT NULL,
    [lengthOfService] FLOAT(53) NOT NULL,
    [pend] VARCHAR(5) NOT NULL,
    [namaSekolah] VARCHAR(100) NOT NULL,
    [namaJurusan] VARCHAR(100) NOT NULL,
    CONSTRAINT [PK_DataKaryawan] PRIMARY KEY CLUSTERED ([nomorIndukKaryawan])
);

-- CreateTable
CREATE TABLE [dbo].[DataLevel] (
    [idLevel] VARCHAR(10) NOT NULL,
    [namaLevel] VARCHAR(50) NOT NULL,
    CONSTRAINT [PK_DataLevel] PRIMARY KEY CLUSTERED ([idLevel])
);

-- CreateTable
CREATE TABLE [dbo].[DataMentorWanted] (
    [idMentorWanted] NVARCHAR(1000) NOT NULL,
    [namaMentor] VARCHAR(100) NOT NULL,
    [posisiMentor] VARCHAR(100) NOT NULL,
    [cabangMentor] VARCHAR(10) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    CONSTRAINT [PK_DataMentorWanted] PRIMARY KEY CLUSTERED ([idMentorWanted])
);

-- CreateTable
CREATE TABLE [dbo].[DataPosition] (
    [namaPosition] VARCHAR(100) NOT NULL,
    CONSTRAINT [PK_DataPosition] PRIMARY KEY CLUSTERED ([namaPosition]),
    CONSTRAINT [DataPosition_namaPosition_key] UNIQUE NONCLUSTERED ([namaPosition])
);

-- CreateTable
CREATE TABLE [dbo].[DataRiwayatGKM] (
    [idRiwayatGKM] NVARCHAR(1000) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [banyakKeikutsertaan] INT NOT NULL,
    [posisiTertinggi] VARCHAR(50) NOT NULL,
    CONSTRAINT [PK_DataRiwayatGKM] PRIMARY KEY CLUSTERED ([idRiwayatGKM])
);

-- CreateTable
CREATE TABLE [dbo].[DataRiwayatKarir] (
    [idCareerHistory] NVARCHAR(1000) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [position] VARCHAR(10) NOT NULL,
    [levelPosition] VARCHAR(10) NOT NULL,
    [personnelArea] VARCHAR(10) NOT NULL,
    [tanggalMulai] DATE,
    [tanggalBerakhir] DATE,
    [status] INT NOT NULL,
    CONSTRAINT [DataRiwayatKarir_pkey] PRIMARY KEY CLUSTERED ([idCareerHistory])
);

-- CreateTable
CREATE TABLE [dbo].[DataRiwayatKepanitiaan] (
    [idRiwayatKepanitiaan] NVARCHAR(1000) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [namaAcara] VARCHAR(100) NOT NULL,
    [namaPosisi] VARCHAR(100) NOT NULL,
    [tahunPelaksanaan] INT NOT NULL,
    CONSTRAINT [PK_DataKepanitiaan] PRIMARY KEY CLUSTERED ([idRiwayatKepanitiaan])
);

-- CreateTable
CREATE TABLE [dbo].[DataRiwayatOrganisasiInternal] (
    [idRiwayatOrganisasiInternal] NVARCHAR(1000) NOT NULL,
    [namaOrganisasi] VARCHAR(100) NOT NULL,
    [namaPosisi] VARCHAR(100) NOT NULL,
    [tahunMulai] INT NOT NULL,
    [tahunSelesai] INT,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    CONSTRAINT [PK_DataRiwayatOrganisasiInternal] PRIMARY KEY CLUSTERED ([idRiwayatOrganisasiInternal])
);

-- CreateTable
CREATE TABLE [dbo].[DataRiwayatProject] (
    [idRiwayatProject] NVARCHAR(1000) NOT NULL,
    [judulProject] VARCHAR(100) NOT NULL,
    [namaPosisi] VARCHAR(100) NOT NULL,
    [lamaKolaborasi] INT NOT NULL,
    [shortDesc] VARCHAR(max) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    CONSTRAINT [PK_DataRiwayatProject] PRIMARY KEY CLUSTERED ([idRiwayatProject])
);

-- CreateTable
CREATE TABLE [dbo].[DataTrainingWanted] (
    [idTraining] NVARCHAR(1000) NOT NULL,
    [nomorIndukKaryawan] VARCHAR(10) NOT NULL,
    [topikTraining] VARCHAR(100) NOT NULL,
    CONSTRAINT [PK_Table1] PRIMARY KEY CLUSTERED ([idTraining])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B61ACEA9432] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateTable
CREATE TABLE [dbo].[AssessmentType] (
    [idAssessmentType] VARCHAR(10) NOT NULL,
    [titleAT] VARCHAR(max) NOT NULL,
    [descAT] VARCHAR(max) NOT NULL,
    [typeAT] VARCHAR(50) NOT NULL,
    [idForm] VARCHAR(10) NOT NULL,
    CONSTRAINT [PK_AssessmentType] PRIMARY KEY CLUSTERED ([idAssessmentType])
);

-- CreateTable
CREATE TABLE [dbo].[Forms] (
    [idForm] VARCHAR(10) NOT NULL,
    [titleForm] VARCHAR(max) NOT NULL,
    [descForm] VARCHAR(max) NOT NULL,
    CONSTRAINT [PK_Forms] PRIMARY KEY CLUSTERED ([idForm])
);

-- CreateTable
CREATE TABLE [dbo].[InvolvedDept] (
    [idID] VARCHAR(10) NOT NULL,
    [idForm] VARCHAR(10) NOT NULL,
    [idDepartement] VARCHAR(10) NOT NULL,
    CONSTRAINT [PK_InvolvedDept] PRIMARY KEY CLUSTERED ([idID])
);

-- CreateTable
CREATE TABLE [dbo].[InvolvedPosition] (
    [idIP] VARCHAR(10) NOT NULL,
    [idAssessmentType] VARCHAR(10) NOT NULL,
    [idPosition] VARCHAR(10) NOT NULL,
    CONSTRAINT [PK_InvolvedPosition] PRIMARY KEY CLUSTERED ([idIP])
);

-- CreateTable
CREATE TABLE [dbo].[Questions] (
    [idQuestion] VARCHAR(10) NOT NULL,
    [titleQue] VARCHAR(max) NOT NULL,
    [Question] VARCHAR(max) NOT NULL,
    [idAT] VARCHAR(10) NOT NULL,
    CONSTRAINT [PK_Questions] PRIMARY KEY CLUSTERED ([idQuestion])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Account_userId_idx] ON [dbo].[Account]([userId]);

-- AddForeignKey
ALTER TABLE [dbo].[DataCareerPlan] ADD CONSTRAINT [FK_DataCareerPlan_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataKaryawan] ADD CONSTRAINT [FK_DataKaryawan_DataBranch] FOREIGN KEY ([personnelArea]) REFERENCES [dbo].[DataBranch]([idBranch]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataKaryawan] ADD CONSTRAINT [FK_DataKaryawan_DataLevel] FOREIGN KEY ([levelPosition]) REFERENCES [dbo].[DataLevel]([idLevel]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataKaryawan] ADD CONSTRAINT [FK_DataKaryawan_DataPosition] FOREIGN KEY ([position]) REFERENCES [dbo].[DataPosition]([namaPosition]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataMentorWanted] ADD CONSTRAINT [FK_DataMentorWanted_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataRiwayatGKM] ADD CONSTRAINT [FK_DataRiwayatGKM_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataRiwayatKarir] ADD CONSTRAINT [FK_DataRiwayatKarir_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataRiwayatKepanitiaan] ADD CONSTRAINT [FK_DataRiwayatKepanitiaan_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataRiwayatOrganisasiInternal] ADD CONSTRAINT [FK_DataRiwayatOrganisasiInternal_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataRiwayatProject] ADD CONSTRAINT [FK_DataRiwayatProject_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DataTrainingWanted] ADD CONSTRAINT [FK_DataTrainingWanted_DataKaryawan] FOREIGN KEY ([nomorIndukKaryawan]) REFERENCES [dbo].[DataKaryawan]([nomorIndukKaryawan]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AssessmentType] ADD CONSTRAINT [FK_AssessmentType_Forms] FOREIGN KEY ([idForm]) REFERENCES [dbo].[Forms]([idForm]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvolvedDept] ADD CONSTRAINT [FK_InvolvedDept_DataDepartment] FOREIGN KEY ([idDepartement]) REFERENCES [dbo].[DataDepartment]([idDepartment]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvolvedDept] ADD CONSTRAINT [FK_InvolvedDept_Forms] FOREIGN KEY ([idForm]) REFERENCES [dbo].[Forms]([idForm]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvolvedPosition] ADD CONSTRAINT [FK_InvolvedPosition_AssessmentType] FOREIGN KEY ([idAssessmentType]) REFERENCES [dbo].[AssessmentType]([idAssessmentType]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Questions] ADD CONSTRAINT [FK_Questions_AssessmentType] FOREIGN KEY ([idAT]) REFERENCES [dbo].[AssessmentType]([idAssessmentType]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
