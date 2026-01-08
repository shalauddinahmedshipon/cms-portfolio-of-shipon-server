/*
  Warnings:

  - A unique constraint covering the columns `[serialNo]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialNo]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialNo]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `SkillCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Blog_serialNo_key" ON "Blog"("serialNo");

-- CreateIndex
CREATE UNIQUE INDEX "Event_serialNo_key" ON "Event"("serialNo");

-- CreateIndex
CREATE UNIQUE INDEX "Project_serialNo_key" ON "Project"("serialNo");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_order_key" ON "Skill"("order");

-- CreateIndex
CREATE UNIQUE INDEX "SkillCategory_order_key" ON "SkillCategory"("order");
