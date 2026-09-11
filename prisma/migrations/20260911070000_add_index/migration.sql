-- CreateIndex
CREATE INDEX "User_employeeId_idx" ON "User"("employeeId");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "Employee_posId_idx" ON "Employee"("posId");

-- CreateIndex
CREATE INDEX "Employee_departmentId_idx" ON "Employee"("departmentId");

-- CreateIndex
CREATE INDEX "Employee_divisionId_idx" ON "Employee"("divisionId");

-- CreateIndex
CREATE INDEX "Employee_officeId_idx" ON "Employee"("officeId");

-- CreateIndex
CREATE INDEX "Employee_unitId_idx" ON "Employee"("unitId");

-- CreateIndex
CREATE INDEX "Assign_assignId_idx" ON "Assign"("assignId");

-- CreateIndex
CREATE INDEX "DetailDoc_meetingDocId_idx" ON "DetailDoc"("meetingDocId");

-- CreateIndex
CREATE INDEX "DetailDoc_dateActive_timeActive_idx" ON "DetailDoc"("dateActive", "timeActive");

-- CreateIndex
CREATE INDEX "DetailDocAssign_detailAssignId_idx" ON "DetailDocAssign"("detailAssignId");
