"use client";

import React from "react";
import { Category } from "@/types/transaction";
import { Budget, CreateBudgetData } from "@/types/budget";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingBudget: Budget | null;
  formData: CreateBudgetData;
  setFormData: (data: CreateBudgetData) => void;
  categories: Category[];
  loading?: boolean;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingBudget,
  formData,
  setFormData,
  categories,
  loading = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const isFormValid = () => {
    return (
      formData.category_id &&
      formData.amount > 0 &&
      formData.start_date &&
      formData.end_date &&
      categories.length > 0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingBudget ? "Edit Budget" : "Tambah Budget Baru"}
          </DialogTitle>
          <DialogDescription>
            {editingBudget
              ? "Ubah budget yang sudah ada"
              : "Buat budget baru untuk mengontrol pengeluaran Anda"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            {categories.length === 0 ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  Tidak ada kategori pengeluaran tersedia. Silakan buat
                  kategori pengeluaran terlebih dahulu.
                </p>
              </div>
            ) : (
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, category_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah Budget</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: Number(e.target.value),
                })
              }
              placeholder="Masukkan jumlah budget"
              min="0"
              step="1000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Periode</Label>
            <Select
              value={formData.period_type}
              onValueChange={(value: "monthly" | "yearly") =>
                setFormData({ ...formData, period_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Bulanan</SelectItem>
                <SelectItem value="yearly">Tahunan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Tanggal Mulai</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Tanggal Berakhir</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                min={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {editingBudget ? "Updating..." : "Creating..."}
                </div>
              ) : (
                editingBudget ? "Update Budget" : "Buat Budget"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetForm;