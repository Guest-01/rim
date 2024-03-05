-- CreateTable
CREATE TABLE "_issuesApplied" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_issuesApplied_A_fkey" FOREIGN KEY ("A") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_issuesApplied_B_fkey" FOREIGN KEY ("B") REFERENCES "Issue" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_issuesApplied_AB_unique" ON "_issuesApplied"("A", "B");

-- CreateIndex
CREATE INDEX "_issuesApplied_B_index" ON "_issuesApplied"("B");
