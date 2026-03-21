"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface AuthFormFieldProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  label: string;
  description?: ReactNode;
  suffix?: ReactNode;
  invalid?: boolean;
  containerClassName?: string;
}

export const AuthFormField = forwardRef<HTMLInputElement, AuthFormFieldProps>(
  function AuthFormField(
    {
      label,
      description,
      suffix,
      invalid = false,
      className,
      containerClassName,
      id,
      ...props
    },
    ref,
  ) {
    const inputId = id ?? props.name;

    return (
      <div className={cn("w-full", containerClassName)}>
        <label
          htmlFor={inputId}
          className="mb-1 flex items-center pl-1 text-xs text-muted-foreground"
        >
          {label}
        </label>
        <div className="relative w-full">
          <input
            {...props}
            id={inputId}
            ref={ref}
            aria-label={label}
            aria-invalid={invalid}
            className={cn(
              "inline-block w-full rounded-[10px] border-4 px-2.5 py-1 text-xl transition-[border,box-shadow] duration-150 focus-visible:outline-none",
              invalid
                ? "border-destructive focus:border-destructive"
                : "border-[rgba(28,31,35,0.3)] focus:border-[#1c1f23]",
              suffix ? "pr-32" : undefined,
              className,
            )}
          />
          {suffix ? (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 select-none text-base font-semibold text-[#1c1f23] sm:text-xl">
              {suffix}
            </div>
          ) : null}
        </div>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    );
  },
);
