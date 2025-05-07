/*
  Warnings:

  - You are about to drop the column `created_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the `_CategoryToTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToTransaction" DROP CONSTRAINT "_CategoryToTransaction_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToTransaction" DROP CONSTRAINT "_CategoryToTransaction_B_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "created_at",
DROP COLUMN "transaction_id",
DROP COLUMN "updated_at";

-- DropTable
DROP TABLE "_CategoryToTransaction";

-- CreateTable
CREATE TABLE "category_on_transaction" (
    "transaction_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "category_on_transaction_pkey" PRIMARY KEY ("transaction_id","category_id")
);

-- AddForeignKey
ALTER TABLE "category_on_transaction" ADD CONSTRAINT "category_on_transaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_on_transaction" ADD CONSTRAINT "category_on_transaction_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
