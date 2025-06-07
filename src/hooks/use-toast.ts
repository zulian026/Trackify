// hooks/use-toast.ts
"use client";

import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

interface UseToastReturn {
  toast: (props: Omit<Toast, "id">) => void;
  toasts: Toast[];
  dismiss: (toastId: string) => void;
  dismissAll: () => void;
}

// Global state untuk toast (bisa juga menggunakan context jika perlu)
let toastCount = 0;
const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(action: { type: string; toast?: Toast; toastId?: string }) {
  switch (action.type) {
    case "ADD_TOAST":
      if (action.toast) {
        memoryState.toasts = [action.toast, ...memoryState.toasts];
      }
      break;
    case "UPDATE_TOAST":
      if (action.toast) {
        memoryState.toasts = memoryState.toasts.map((t) =>
          t.id === action.toast!.id ? { ...t, ...action.toast } : t
        );
      }
      break;
    case "DISMISS_TOAST":
      if (action.toastId) {
        memoryState.toasts = memoryState.toasts.filter(
          (t) => t.id !== action.toastId
        );
      }
      break;
    case "REMOVE_TOAST":
      if (action.toastId) {
        memoryState.toasts = memoryState.toasts.filter(
          (t) => t.id !== action.toastId
        );
      }
      break;
    case "DISMISS_ALL":
      memoryState.toasts = [];
      break;
  }

  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return toastCount.toString();
}

export function useToast(): UseToastReturn {
  const [state, setState] = useState<ToastState>(memoryState);

  // Subscribe to state changes
  const listener = useCallback((newState: ToastState) => {
    setState(newState);
  }, []);

  // Add listener on mount, remove on unmount
  useState(() => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  });

  return {
    toasts: state.toasts,
    toast: ({ title, description, variant = "default", duration = 5000 }) => {
      const id = genId();

      const toast: Toast = {
        id,
        title,
        description,
        variant,
        duration,
      };

      dispatch({ type: "ADD_TOAST", toast });

      // Auto dismiss toast after duration
      if (duration > 0) {
        setTimeout(() => {
          dispatch({ type: "DISMISS_TOAST", toastId: id });
        }, duration);
      }
    },
    dismiss: (toastId: string) => {
      dispatch({ type: "DISMISS_TOAST", toastId });
    },
    dismissAll: () => {
      dispatch({ type: "DISMISS_ALL" });
    },
  };
}
