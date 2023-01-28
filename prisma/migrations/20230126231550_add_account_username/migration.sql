/*
  Warnings:

  - Added the required column `username` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "username" TEXT NOT NULL;
