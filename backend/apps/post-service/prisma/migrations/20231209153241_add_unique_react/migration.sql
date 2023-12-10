/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId,type]` on the table `react` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,commentId,type]` on the table `react` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `react_userId_postId_type_key` ON `react`(`userId`, `postId`, `type`);

-- CreateIndex
CREATE UNIQUE INDEX `react_userId_commentId_type_key` ON `react`(`userId`, `commentId`, `type`);
