/*
  Warnings:

  - You are about to drop the column `amount` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `amount_in_cents` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "amount",
ADD COLUMN     "amount_in_cents" INTEGER NOT NULL;
