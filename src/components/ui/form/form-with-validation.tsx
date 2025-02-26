'use client'

import * as React from 'react'
import { z } from 'zod'

import { useForm, FormState, FormHandler } from '@/lib-new/utils/form'
import { cn } from '@/lib-new/utils/cn'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

/**
 * Props for the ZodForm component
 */
interface ZodFormProps<T extends z.ZodType<any, any>> {
  /**
   * Schema for form validation
   */
  schema: T
  
  /**
   * Initial values for the form
   */
  defaultValues: z.infer<T>
  
  /**
   * Callback when form is submitted with valid data
   */
  onSubmit: (values: z.infer<T>) => Promise<void> | void
  
  /**
   * Children render function to render form fields
   */
  children: (
    state: FormState<z.infer<T>>,
    handlers: FormHandler<z.infer<T>>,
  ) => React.ReactNode
  
  /**
   * Whether to show submit button
   */
  showSubmitButton?: boolean
  
  /**
   * Submit button text
   */
  submitText?: string
  
  /**
   * Additional form class names
   */
  className?: string
}

/**
 * Form component with Zod validation
 * Uses our custom form utilities for state management and validation
 */
export function ZodForm<T extends z.ZodType<any, any>>({
  schema,
  defaultValues,
  onSubmit,
  children,
  showSubmitButton = true,
  submitText = 'Submit',
  className,
}: ZodFormProps<T>) {
  const [state, handlers] = useForm({
    initialValues: defaultValues as any,
    validationSchema: schema,
    onSubmit: onSubmit as any,
    validateOnChange: true,
    validateOnBlur: true,
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handlers.handleSubmit()
  }
  
  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {children(state, handlers)}
      
      {showSubmitButton && (
        <Button 
          type="submit" 
          disabled={!state.isValid || state.isSubmitting}
        >
          {state.isSubmitting ? 'Submitting...' : submitText}
        </Button>
      )}
    </form>
  )
}

/**
 * Example usage component with a login form
 */
export function LoginForm() {
  // Define the form schema with Zod
  const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    rememberMe: z.boolean().optional(),
  })
  
  // Define the form's initial values
  const defaultValues = {
    email: "",
    password: "",
    rememberMe: false,
  }
  
  // Handle form submission
  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log("Form submitted with:", values)
    // In a real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return (
    <ZodForm
      schema={loginSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto"
      submitText="Sign In"
    >
      {(state, handlers) => (
        <>
          <FormField
            name="email"
            value={state.values.email}
            onChange={(e) => handlers.handleChange('email', e.target.value)}
            onBlur={() => handlers.handleBlur('email')}
            error={state.errors.email}
            label="Email"
            placeholder="Enter your email"
            type="email"
            touched={state.touched.email}
          />
          
          <FormField
            name="password"
            value={state.values.password}
            onChange={(e) => handlers.handleChange('password', e.target.value)}
            onBlur={() => handlers.handleBlur('password')}
            error={state.errors.password}
            label="Password"
            placeholder="Enter your password"
            type="password"
            touched={state.touched.password}
          />
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={state.values.rememberMe}
              onChange={(e) => handlers.handleChange('rememberMe', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="rememberMe" className="text-sm font-medium text-gray-700">
              Remember me
            </label>
          </div>
        </>
      )}
    </ZodForm>
  )
}

/**
 * Reusable form field component
 */
interface FormFieldProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  error?: string
  label: string
  placeholder?: string
  type?: string
  touched?: boolean
  description?: string
}

function FormField({
  name,
  value,
  onChange,
  onBlur,
  error,
  label,
  placeholder,
  type = 'text',
  touched,
  description,
}: FormFieldProps) {
  const hasError = !!error && touched
  
  return (
    <FormItem>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <FormControl>
        <Input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          type={type}
          className={cn(hasError && "border-red-500")}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      {hasError && <FormMessage>{error}</FormMessage>}
    </FormItem>
  )
}
