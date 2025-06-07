"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Minus } from "lucide-react";
import {
  Transaction,
  CreateTransactionData,
  Category,
} from "@/types/transaction";
import { TransactionService } from "@/lib/services/transactionService";
import { CategoryService } from "@/lib/services/categoryService";
import { useToast } from "@/hooks/use-toast";

interface TransactionFormProps {
  userId: string;
  transaction?: Transaction;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TransactionForm({
  userId,
  transaction,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState<CreateTransactionData>({
    category_id: "",
    amount: 0,
    type: "expense",
    description: "",
    transaction_date: new Date().toISOString().split("T")[0],
  });

  // Memuat kategori
  useEffect(() => {
    loadCategories();
  }, [userId]);

  // Isi data jika sedang mengedit
  useEffect(() => {
    if (transaction) {
      setFormData({
        category_id: transaction.category_id,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description || "",
        transaction_date: transaction.transaction_date,
      });
    }
  }, [transaction]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await CategoryService.getCategories(userId);
      setCategories(data);
    } catch (error) {
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal memuat kategori",
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category_id || formData.amount <= 0) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon isi semua kolom yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (transaction) {
        await TransactionService.updateTransaction(userId, {
          id: transaction.id,
          ...formData,
        });
        toast({
          title: "Berhasil",
          description: "Transaksi berhasil diperbarui",
        });
      } else {
        await TransactionService.createTransaction(userId, formData);
        toast({
          title: "Berhasil",
          description: "Transaksi berhasil dibuat",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Terjadi Kesalahan",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan tidak diketahui",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: "income" | "expense") => {
    setFormData((prev) => ({
      ...prev,
      type,
      category_id: "", // Reset kategori saat jenis berubah
    }));
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {transaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Jenis Transaksi */}
          <div className="space-y-2">
            <Label>Jenis Transaksi</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.type === "income" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTypeChange("income")}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Pemasukan
              </Button>
              <Button
                type="button"
                variant={formData.type === "expense" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTypeChange("expense")}
                className="flex items-center gap-1"
              >
                <Minus className="w-4 h-4" />
                Pengeluaran
              </Button>
            </div>
          </div>

          {/* Nominal */}
          <div className="space-y-2">
            <Label htmlFor="amount">Nominal *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="0.00"
              required
            />
            {formData.amount > 0 && (
              <p className="text-sm text-muted-foreground">
                {formatCurrency(formData.amount)}
              </p>
            )}
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            {loadingCategories ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Memuat kategori...
              </div>
            ) : (
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category_id: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
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

            {filteredCategories.length === 0 && !loadingCategories && (
              <p className="text-sm text-muted-foreground">
                Tidak ada kategori {formData.type}. Silakan buat terlebih dahulu.
              </p>
            )}
          </div>

          {/* Tanggal */}
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal *</Label>
            <Input
              id="date"
              type="date"
              value={formData.transaction_date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  transaction_date: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Deskripsi opsional..."
              rows={3}
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || filteredCategories.length === 0}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {transaction ? "Perbarui" : "Buat"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
