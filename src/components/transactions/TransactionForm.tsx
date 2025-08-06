"use client";

import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Plus,
  Minus,
  Calculator,
  Delete,
  X,
  Divide,
  Equal,
  TrendingUp,
  TrendingDown,
  Calendar,
  Tag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Transaction,
  CreateTransactionData,
  Category,
} from "@/types/transaction";
import { TransactionService } from "@/lib/services/transactionService";
import { CategoryService } from "@/lib/services/categoryService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  userId: string;
  transaction?: Transaction;
  onSuccess: () => void;
  onCancel: () => void;
}

// Komponen Kalkulator yang Ringkas
interface CalculatorInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({
  value,
  onChange,
  label = "Nominal",
}) => {
  const [display, setDisplay] = useState(value > 0 ? value.toString() : "0");
  const [previousValue, setPreviousValue] = useState<string>("");
  const [operation, setOperation] = useState<string>("");
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [inputValue, setInputValue] = useState(
    value > 0 ? value.toString() : ""
  );

  useEffect(() => {
    if (value !== parseFloat(inputValue)) {
      setInputValue(value > 0 ? value.toString() : "");
      setDisplay(value > 0 ? value.toString() : "0");
    }
  }, [value]);

  const inputDigit = (digit: string) => {
    if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue("");
    setOperation("");
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === "") {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = parseFloat(previousValue);
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(String(newValue));
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string
  ): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== "" && operation) {
      const currentValue = parseFloat(previousValue);
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue("");
      setOperation("");
      setWaitingForNewValue(true);
    }
  };

  const handleUseValue = () => {
    const numValue = parseFloat(display);
    onChange(numValue);
    setInputValue(display);
    setShowCalculator(false);
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    const numValue = parseFloat(val) || 0;
    onChange(numValue);
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const CalcButton: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    variant?: "default" | "operation" | "equals";
    className?: string;
  }> = ({ onClick, children, variant = "default", className = "" }) => {
    const variants = {
      default: "bg-white hover:bg-gray-50 text-gray-900 border-gray-300",
      operation: "bg-green-500 hover:bg-green-600 text-white",
      equals: "bg-green-600 hover:bg-green-700 text-white",
    };

    return (
      <button
        type="button"
        onClick={onClick}
        className={`h-10 px-3 rounded-lg border font-semibold text-sm transition-all duration-300 ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-gray-700">{label} *</Label>

      <div className="flex gap-3">
        <div className="relative flex-1">
          {/* <p className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
          <p className="absolute left-3 top-1/3 transform -translate-y-1/3 w-4 h-4 text-gray-800">Rp</p>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="0.00"
            className="pl-10 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50 focus:bg-white transition-all duration-300"
            required
          />
        </div>

        <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="h-11 w-11 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all duration-300 flex items-center justify-center"
            >
              <Calculator className="h-4 w-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-900">
                Kalkulator
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Display */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="text-xs text-gray-500 h-4 mb-1">
                  {previousValue &&
                    operation &&
                    `${previousValue} ${operation}`}
                </div>
                <div className="text-xl font-bold text-gray-900 mb-2">
                  {display}
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  {formatCurrency(display)}
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <CalcButton onClick={clear} className="col-span-2">
                  Clear
                </CalcButton>
                <CalcButton onClick={() => setDisplay(display.slice(0, -1))}>
                  <Delete className="h-4 w-4" />
                </CalcButton>
                <CalcButton
                  onClick={() => performOperation("÷")}
                  variant="operation"
                >
                  ÷
                </CalcButton>

                <CalcButton onClick={() => inputDigit("7")}>7</CalcButton>
                <CalcButton onClick={() => inputDigit("8")}>8</CalcButton>
                <CalcButton onClick={() => inputDigit("9")}>9</CalcButton>
                <CalcButton
                  onClick={() => performOperation("×")}
                  variant="operation"
                >
                  ×
                </CalcButton>

                <CalcButton onClick={() => inputDigit("4")}>4</CalcButton>
                <CalcButton onClick={() => inputDigit("5")}>5</CalcButton>
                <CalcButton onClick={() => inputDigit("6")}>6</CalcButton>
                <CalcButton
                  onClick={() => performOperation("-")}
                  variant="operation"
                >
                  -
                </CalcButton>

                <CalcButton onClick={() => inputDigit("1")}>1</CalcButton>
                <CalcButton onClick={() => inputDigit("2")}>2</CalcButton>
                <CalcButton onClick={() => inputDigit("3")}>3</CalcButton>
                <CalcButton
                  onClick={() => performOperation("+")}
                  variant="operation"
                >
                  +
                </CalcButton>

                <CalcButton
                  onClick={() => inputDigit("0")}
                  className="col-span-2"
                >
                  0
                </CalcButton>
                <CalcButton onClick={inputDecimal}>.</CalcButton>
                <CalcButton onClick={handleEquals} variant="equals">
                  =
                </CalcButton>
              </div>

              <button
                type="button"
                onClick={handleUseValue}
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Gunakan: {formatCurrency(display)}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {parseFloat(inputValue) > 0 && (
        <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
          {formatCurrency(inputValue)}
        </div>
      )}
    </div>
  );
};

// ... import tetap sama ...

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

  useEffect(() => {
    loadCategories();
  }, [userId]);

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
        title: "Error",
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
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tidak diketahui",
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
      category_id: "",
    }));
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type
  );

  return (
    <div className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 px-2">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                formData.type === "income"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {formData.type === "income" ? (
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {transaction ? "Edit Transaksi" : "Tambah Transaksi"}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Jenis Transaksi */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">
                Jenis Transaksi
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange("income")}
                  className={cn(
                    "flex items-center justify-center gap-2 h-10 px-4 rounded-lg border font-semibold text-sm transition-all duration-300",
                    formData.type === "income"
                      ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300"
                  )}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Pemasukan
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("expense")}
                  className={cn(
                    "flex items-center justify-center gap-2 h-10 px-4 rounded-lg border font-semibold text-sm transition-all duration-300",
                    formData.type === "expense"
                      ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300"
                  )}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  Pengeluaran
                </button>
              </div>
            </div>

            {/* Nominal dengan Kalkulator */}
            <CalculatorInput
              value={formData.amount}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: value,
                }))
              }
              label="Nominal"
            />

            {/* Kategori */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Kategori *
              </Label>
              {loadingCategories ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-200">
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
                  <SelectTrigger className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50 focus:bg-white transition-all duration-300">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm">{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Tanggal */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tanggal *
              </Label>
              <Input
                type="date"
                value={formData.transaction_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    transaction_date: e.target.value,
                  }))
                }
                className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50 focus:bg-white transition-all duration-300"
                required
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">
                Deskripsi
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Deskripsi opsional..."
                rows={3}
                className="resize-none text-sm border-gray-300 focus:border-green-500 focus:ring-green-500 bg-gray-50 focus:bg-white transition-all duration-300"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 h-10 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || filteredCategories.length === 0}
                className={cn(
                  "flex-1 h-10 px-4 font-semibold rounded-lg text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                  formData.type === "income"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                )}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {transaction ? "Perbarui" : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
