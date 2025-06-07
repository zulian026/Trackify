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
  Loader2,
  Plus,
  Minus,
  Calculator,
  Delete,
  X,
  Divide,
  Equal,
} from "lucide-react";
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

// Komponen Kalkulator Input
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

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
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

  const CalculatorButton: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    variant?: "default" | "operation" | "equals" | "secondary";
    className?: string;
  }> = ({ onClick, children, variant = "default", className = "" }) => {
    const baseClass =
      "h-10 text-sm font-semibold transition-all duration-150 hover:scale-105";
    const variants = {
      default: "bg-gray-100 hover:bg-gray-200 text-gray-800",
      operation: "bg-blue-500 hover:bg-blue-600 text-white",
      equals: "bg-green-500 hover:bg-green-600 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-700",
    };

    return (
      <Button
        type="button"
        onClick={onClick}
        className={`${baseClass} ${variants[variant]} ${className}`}
        variant="ghost"
        size="sm"
      >
        {children}
      </Button>
    );
  };

  return (
    <div className="space-y-2">
      <Label>{label} *</Label>

      {/* Input dengan tombol kalkulator */}
      <div className="flex gap-2">
        <Input
          type="number"
          step="0.01"
          min="0.01"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="0.00"
          className="flex-1"
          required
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowCalculator(!showCalculator)}
          className="shrink-0"
        >
          <Calculator className="h-4 w-4" />
        </Button>
      </div>

      {/* Preview mata uang */}
      {parseFloat(inputValue) > 0 && (
        <Badge variant="outline" className="text-sm">
          {formatCurrency(inputValue)}
        </Badge>
      )}

      {/* Kalkulator */}
      {showCalculator && (
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Kalkulator</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowCalculator(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Display */}
            <div className="bg-gray-50 p-3 rounded-lg text-right">
              <div className="text-xs text-gray-500 h-4">
                {previousValue && operation && `${previousValue} ${operation}`}
              </div>
              <div className="text-xl font-bold text-gray-800">{display}</div>
              <div className="text-xs text-green-600 mt-1">
                {formatCurrency(display)}
              </div>
            </div>

            {/* Tombol-tombol */}
            <div className="grid grid-cols-4 gap-1.5">
              {/* Baris 1 */}
              <CalculatorButton
                onClick={clear}
                variant="secondary"
                className="col-span-2"
              >
                Clear
              </CalculatorButton>
              <CalculatorButton onClick={backspace} variant="secondary">
                <Delete className="h-3 w-3" />
              </CalculatorButton>
              <CalculatorButton
                onClick={() => performOperation("÷")}
                variant="operation"
              >
                <Divide className="h-3 w-3" />
              </CalculatorButton>

              {/* Baris 2 */}
              <CalculatorButton onClick={() => inputDigit("7")}>
                7
              </CalculatorButton>
              <CalculatorButton onClick={() => inputDigit("8")}>
                8
              </CalculatorButton>
              <CalculatorButton onClick={() => inputDigit("9")}>
                9
              </CalculatorButton>
              <CalculatorButton
                onClick={() => performOperation("×")}
                variant="operation"
              >
                <X className="h-3 w-3" />
              </CalculatorButton>

              {/* Baris 3 */}
              <CalculatorButton onClick={() => inputDigit("4")}>
                4
              </CalculatorButton>
              <CalculatorButton onClick={() => inputDigit("5")}>
                5
              </CalculatorButton>
              <CalculatorButton onClick={() => inputDigit("6")}>
                6
              </CalculatorButton>
              <CalculatorButton
                onClick={() => performOperation("-")}
                variant="operation"
              >
                <Minus className="h-3 w-3" />
              </CalculatorButton>

              {/* Baris 4 */}
              <CalculatorButton onClick={() => inputDigit("1")}>
                1
              </CalculatorButton>
              <CalculatorButton onClick={() => inputDigit("2")}>
                2
              </CalculatorButton>
              <CalculatorButton onClick={() => inputDigit("3")}>
                3
              </CalculatorButton>
              <CalculatorButton
                onClick={() => performOperation("+")}
                variant="operation"
              >
                <Plus className="h-3 w-3" />
              </CalculatorButton>

              {/* Baris 5 */}
              <CalculatorButton
                onClick={() => inputDigit("0")}
                className="col-span-2"
              >
                0
              </CalculatorButton>
              <CalculatorButton onClick={inputDecimal}>.</CalculatorButton>
              <CalculatorButton onClick={handleEquals} variant="equals">
                <Equal className="h-3 w-3" />
              </CalculatorButton>
            </div>

            {/* Tombol gunakan nilai */}
            <Button
              type="button"
              onClick={handleUseValue}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              Gunakan: {formatCurrency(display)}
            </Button>
          </CardContent>
        </Card>
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
      category_id: "", // Reset kategori saat jenis berubah
    }));
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type
  );

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
                Tidak ada kategori {formData.type}. Silakan buat terlebih
                dahulu.
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
