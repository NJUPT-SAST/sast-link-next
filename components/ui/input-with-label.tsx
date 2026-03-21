"use client";

import type { ReactNode } from "react";
import { forwardRef } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/utils";

interface InputWithLabelProps {
  type?: "password" | "text";
  children?: ReactNode;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  error: { error: false } | { error: true; errMsg: string };
  inputProps?: UseFormRegisterReturn<string>;
}

export const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  function InputWithLabel(props, ref) {
    const {
      disabled = false,
      type,
      className,
      children,
      maxLength,
      label,
      error,
      name,
      defaultValue,
      placeholder,
      inputProps,
    } = props;

    return (
      <label className="flex w-full flex-col items-center">
        <span
          className={cn(
            "flex h-6 items-center self-start pl-1 pt-1 text-xs transition-all",
            error.error
              ? "text-destructive opacity-100"
              : "text-muted-foreground",
          )}
        >
          {error.error ? error.errMsg : label}
        </span>
        <div className="relative w-full">
          <input
            {...inputProps}
            disabled={disabled}
            type={type}
            aria-label={label}
            name={name}
            maxLength={maxLength}
            placeholder={placeholder}
            defaultValue={defaultValue}
            ref={ref}
            className={cn(
              "inline-block w-full rounded-[10px] border-4 px-2.5 py-1 text-xl transition-[border] duration-150",
              error.error
                ? "border-destructive focus:border-destructive focus-visible:outline-none"
                : "border-[rgba(28,31,35,0.3)] focus:border-[#1c1f23]",
              className,
            )}
          />
          {children && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 select-none text-xl text-[#1c1f23]">
              {children}
            </div>
          )}
        </div>
      </label>
    );
  },
);
