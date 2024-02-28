-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT
);

-- CreateTable
CREATE TABLE "_AccountToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AccountToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AccountToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Issue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER,
    "issueStatusId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER,
    "assigneeId" INTEGER,
    CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Issue_issueStatusId_fkey" FOREIGN KEY ("issueStatusId") REFERENCES "IssueStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Issue_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Issue_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Issue" ("assigneeId", "authorId", "content", "createdAt", "id", "issueStatusId", "title", "updatedAt") SELECT "assigneeId", "authorId", "content", "createdAt", "id", "issueStatusId", "title", "updatedAt" FROM "Issue";
DROP TABLE "Issue";
ALTER TABLE "new_Issue" RENAME TO "Issue";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Project_title_key" ON "Project"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_AccountToProject_AB_unique" ON "_AccountToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountToProject_B_index" ON "_AccountToProject"("B");
