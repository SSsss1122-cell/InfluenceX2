"use client";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui/label";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  render: (field: {
    value: any;
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  }) => React.ReactNode;
};

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  render,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          {render(field)}
          {description && !fieldState.error && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}