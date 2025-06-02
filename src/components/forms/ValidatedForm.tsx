
import { useForm, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useErrorHandler } from '@/utils/errorHandler';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface FormFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'date' | 'time';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
}

interface ValidatedFormProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  fields: FormFieldConfig<T>[];
  onSubmit: (data: T) => Promise<void> | void;
  defaultValues?: Partial<T>;
  submitText?: string;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ValidatedForm<T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  defaultValues,
  submitText = 'Salvar',
  loading = false,
  className,
  children
}: ValidatedFormProps<T>) {
  const { handleError } = useErrorHandler();
  
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any
  });

  const handleSubmit = async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error) {
      handleError(error, 'Form submission');
    }
  };

  const renderField = (field: FormFieldConfig<T>) => {
    const { name, label, type = 'text', placeholder, options, required, disabled } = field;

    return (
      <FormField
        key={name}
        control={form.control}
        name={name}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {type === 'textarea' ? (
                <Textarea
                  placeholder={placeholder}
                  disabled={disabled || loading}
                  {...formField}
                />
              ) : type === 'select' ? (
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                  disabled={disabled || loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled || loading}
                  {...formField}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        <div className="space-y-4">
          {fields.map(renderField)}
          {children}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            type="submit" 
            disabled={loading || !form.formState.isValid}
            className="min-w-[120px]"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              submitText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Hook to get form instance for external control
export function useValidatedForm<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  defaultValues?: Partial<T>
): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any
  });
}
