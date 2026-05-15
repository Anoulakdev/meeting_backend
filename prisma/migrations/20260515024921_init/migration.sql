-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "employeeId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsible" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "divisionId" INTEGER,
    "officeId" INTEGER,

    CONSTRAINT "Responsible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FcmToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "platform" VARCHAR(255) NOT NULL,
    "model" VARCHAR(255) NOT NULL,
    "fcmtoken" VARCHAR(255) NOT NULL,

    CONSTRAINT "FcmToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" INTEGER NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "emp_code" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "gender" VARCHAR(255),
    "tel" VARCHAR(255),
    "email" VARCHAR(255),
    "empimg" VARCHAR(255),
    "posId" INTEGER,
    "departmentId" INTEGER,
    "divisionId" INTEGER,
    "officeId" INTEGER,
    "unitId" INTEGER,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" INTEGER NOT NULL,
    "department_name" VARCHAR(255),
    "department_code" VARCHAR(50),
    "department_status" VARCHAR(50) NOT NULL DEFAULT 'A',

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Division" (
    "id" INTEGER NOT NULL,
    "division_name" VARCHAR(255),
    "division_code" VARCHAR(50),
    "division_status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "branch_id" INTEGER,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Office" (
    "id" INTEGER NOT NULL,
    "office_name" VARCHAR(255),
    "office_code" VARCHAR(50),
    "office_status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "divisionId" INTEGER,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" INTEGER NOT NULL,
    "unit_name" VARCHAR(255),
    "unit_code" VARCHAR(50),
    "unit_status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "unit_type" VARCHAR(50),
    "divisionId" INTEGER,
    "officeId" INTEGER,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionGroup" (
    "id" INTEGER NOT NULL,
    "pos_group_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "PositionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionCode" (
    "id" INTEGER NOT NULL,
    "pos_code_name" VARCHAR(255) NOT NULL,
    "pos_code_status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "posgroupId" INTEGER,

    CONSTRAINT "PositionCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" INTEGER NOT NULL,
    "pos_name" VARCHAR(255) NOT NULL,
    "pos_status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "poscodeId" INTEGER,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingDoc" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMPTZ(0) NOT NULL,
    "endDate" TIMESTAMPTZ(0) NOT NULL,
    "startTime" VARCHAR(50) NOT NULL,
    "endTime" VARCHAR(50) NOT NULL,
    "location" TEXT,
    "docfile" VARCHAR(255) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "MeetingDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assign" (
    "id" SERIAL NOT NULL,
    "meetingDocId" INTEGER NOT NULL,
    "assignId" INTEGER NOT NULL,

    CONSTRAINT "Assign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailDoc" (
    "id" SERIAL NOT NULL,
    "meetingDocId" INTEGER NOT NULL,
    "dateActive" TIMESTAMPTZ(0) NOT NULL,
    "timeActive" VARCHAR(50) NOT NULL,

    CONSTRAINT "DetailDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailDocAssign" (
    "id" SERIAL NOT NULL,
    "detailDocId" INTEGER NOT NULL,
    "detailAssignId" INTEGER NOT NULL,

    CONSTRAINT "DetailDocAssign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Responsible_userId_divisionId_officeId_key" ON "Responsible"("userId", "divisionId", "officeId");

-- CreateIndex
CREATE UNIQUE INDEX "FcmToken_userId_platform_model_key" ON "FcmToken"("userId", "platform", "model");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_emp_code_key" ON "Employee"("emp_code");

-- CreateIndex
CREATE INDEX "MeetingDoc_createdById_idx" ON "MeetingDoc"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Assign_meetingDocId_assignId_key" ON "Assign"("meetingDocId", "assignId");

-- CreateIndex
CREATE UNIQUE INDEX "DetailDocAssign_detailDocId_detailAssignId_key" ON "DetailDocAssign"("detailDocId", "detailAssignId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsible" ADD CONSTRAINT "Responsible_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsible" ADD CONSTRAINT "Responsible_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsible" ADD CONSTRAINT "Responsible_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FcmToken" ADD CONSTRAINT "FcmToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionCode" ADD CONSTRAINT "PositionCode_posgroupId_fkey" FOREIGN KEY ("posgroupId") REFERENCES "PositionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_poscodeId_fkey" FOREIGN KEY ("poscodeId") REFERENCES "PositionCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingDoc" ADD CONSTRAINT "MeetingDoc_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assign" ADD CONSTRAINT "Assign_meetingDocId_fkey" FOREIGN KEY ("meetingDocId") REFERENCES "MeetingDoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assign" ADD CONSTRAINT "Assign_assignId_fkey" FOREIGN KEY ("assignId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailDoc" ADD CONSTRAINT "DetailDoc_meetingDocId_fkey" FOREIGN KEY ("meetingDocId") REFERENCES "MeetingDoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailDocAssign" ADD CONSTRAINT "DetailDocAssign_detailDocId_fkey" FOREIGN KEY ("detailDocId") REFERENCES "DetailDoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailDocAssign" ADD CONSTRAINT "DetailDocAssign_detailAssignId_fkey" FOREIGN KEY ("detailAssignId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
