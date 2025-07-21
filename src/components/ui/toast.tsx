'use client';

import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  id: string | number;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
}

function Toast(props: ToastProps) {
  const { id, type = 'info', title, description } = props;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-[#86efac] border-[#4ade80] text-gray-800';
      case 'error':
        return 'bg-[#FF7171] border-[#f87171] text-white';
      case 'warning':
        return 'bg-[#FBF3B9] border-[#facc15] text-gray-800';
      case 'info':
        return 'bg-[#93c5fd] border-[#60a5fa] text-white';
      default:
        return 'bg-[#93c5fd] border-[#60a5fa] text-white';
    }
  };

  const getToastIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-700" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-700" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-700" />;
      case 'info':
        return <Info size={20} className="text-blue-700" />;
      default:
        return <Info size={20} className="text-blue-700" />;
    }
  };

  return (
    <div className={`flex rounded-md border shadow-lg w-full min-w-[300px] md:max-w-[420px] items-center p-3 ${getToastStyles()}`}>
      {/* Icon */}
      <div className="mr-3 shrink-0">
        {getToastIcon()}
      </div>
      
      {/* Content */}
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-semibold">{description || title}</p>
        </div>
      </div>
      
      {/* Close Button */}
      <button
        className="ml-4 shrink-0 rounded p-1 hover:bg-black/10 transition-colors cursor-pointer"
        onClick={() => sonnerToast.dismiss(id)}
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Abstracted toast functions
export function toast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      type={toast.type}
      title={toast.title}
      description={toast.description}
    />
  ));
}

export function toastSuccess(title: string, description?: string) {
  return toast({ type: 'success', title, description });
}

export function toastError(title: string, description?: string) {
  return toast({ type: 'error', title, description });
}

export function toastWarning(title: string, description?: string) {
  return toast({ type: 'warning', title, description });
}

export function toastInfo(title: string, description?: string) {
  return toast({ type: 'info', title, description });
} 