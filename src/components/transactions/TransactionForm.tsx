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
      operation: "bg-blue-500 hover:bg-blue-600 text-white",
      equals: "bg-green-500 hover:bg-green-600 text-white",
    };

    return (
      <Button
        type="button"
        onClick={onClick}
        className={`h-8 text-xs ${variants[variant]} ${className}`}
        size="sm"
      >
        {children}
      </Button>
    );
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label} *</Label>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="0.00"
            className="pl-8 h-9"
            required
          />
        </div>
        
        <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0"
            >
              <Calculator className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle className="text-sm">Kalkulator</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-3">
              {/* Display */}
              <div className="bg-gray-50 p-2 rounded text-right border">
                <div className="text-xs text-gray-500 h-3">
                  {previousValue && operation && `${previousValue} ${operation}`}
                </div>
                <div className="text-lg font-bold">{display}</div>
                <div className="text-xs text-green-600">
                  {formatCurrency(display)}
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-4 gap-1">
                <CalcButton onClick={clear} className="col-span-2 text-xs">
                  Clear
                </CalcButton>
                <CalcButton onClick={() => setDisplay(display.slice(0, -1))}>
                  <Delete className="h-3 w-3" />
                </CalcButton>
                <CalcButton onClick={() => performOperation("÷")} variant="operation">
                  ÷
                </CalcButton>

                <CalcButton onClick={() => inputDigit("7")}>7</CalcButton>
                <CalcButton onClick={() => inputDigit("8")}>8</CalcButton>
                <CalcButton onClick={() => inputDigit("9")}>9</CalcButton>
                <CalcButton onClick={() => performOperation("×")} variant="operation">×</CalcButton>

                <CalcButton onClick={() => inputDigit("4")}>4</CalcButton>
                <CalcButton onClick={() => inputDigit("5")}>5</CalcButton>
                <CalcButton onClick={() => inputDigit("6")}>6</CalcButton>
                <CalcButton onClick={() => performOperation("-")} variant="operation">-</CalcButton>

                <CalcButton onClick={() => inputDigit("1")}>1</CalcButton>
                <CalcButton onClick={() => inputDigit("2")}>2</CalcButton>
                <CalcButton onClick={() => inputDigit("3")}>3</CalcButton>
                <CalcButton onClick={() => performOperation("+")} variant="operation">+</CalcButton>

                <CalcButton onClick={() => inputDigit("0")} className="col-span-2">0</CalcButton>
                <CalcButton onClick={inputDecimal}>.</CalcButton>
                <CalcButton onClick={handleEquals} variant="equals">=</CalcButton>
              </div>

              <Button
                type="button"
                onClick={handleUseValue}
                className="w-full h-8 text-xs bg-green-600 hover:bg-green-700"
                size="sm"
              >
                Gunakan: {formatCurrency(display)}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {parseFloat(inputValue) > 0 && (
        <Badge variant="secondary" className="text-xs">
          {formatCurrency(inputValue)}
        </Badge>
      )}
    </div>
  );
};

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
    <div className="w-full max-w-md mx-auto">
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            {formData.type === "income" ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            {transaction ? "Edit Transaksi" : "Tambah Transaksi"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Jenis Transaksi */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Jenis Transaksi</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={formData.type === "income" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeChange("income")}
                  className={cn(
                    "flex items-center gap-1 h-8 text-xs",
                    formData.type === "income"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <TrendingUp className="w-3 h-3" />
                  Pemasukan
                </Button>
                <Button
                  type="button"
                  variant={formData.type === "expense" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeChange("expense")}
                  className={cn(
                    "flex items-center gap-1 h-8 text-xs",
                    formData.type === "expense"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <TrendingDown className="w-3 h-3" />
                  Pengeluaran
                </Button>
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
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Kategori *
              </Label>
              {loadingCategories ? (
                <div className="flex items-center gap-2 text-xs text-gray-500 p-2 bg-gray-50 rounded border">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Memuat...
                </div>
              ) : (
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category_id: value }))
                  }
                  required
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
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
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" />
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
                className="h-9"
                required
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Deskripsi</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Deskripsi opsional..."
                rows={2}
                className="resize-none text-sm"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 h-9 text-xs"
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className={cn(
                  "flex-1 h-9 text-xs text-white",
                  formData.type === "income"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                )}
                disabled={loading || filteredCategories.length === 0}
              >
                {loading && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                {transaction ? "Perbarui" : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}