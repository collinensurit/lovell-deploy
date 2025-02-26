'use client'

import { z } from 'zod'

/**
 * Form state interface for managing form values and errors
 */
export interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

/**
 * Form handler interface for form actions
 */
export interface FormHandler<T> {
  handleChange: (field: keyof T, value: any) => void
  handleBlur: (field: keyof T) => void
  handleSubmit: (e?: React.FormEvent) => Promise<boolean>
  reset: () => void
  setValues: (values: Partial<T>) => void
  setValue: (field: keyof T, value: any) => void
  setError: (field: keyof T, error: string | null) => void
  setTouched: (field: keyof T, isTouched: boolean) => void
}

/**
 * Form handler options
 */
export interface FormHandlerOptions<T> {
  initialValues: T
  onSubmit: (values: T) => Promise<void> | void
  validationSchema?: z.ZodType<T>
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

/**
 * Create a form handler with state management and validation
 * 
 * @param options - Form handler options
 * @returns Form state and handlers
 */
export function useForm<T extends Record<string, any>>(
  options: FormHandlerOptions<T>
): [FormState<T>, FormHandler<T>] {
  const {
    initialValues,
    onSubmit,
    validationSchema,
    validateOnChange = true,
    validateOnBlur = true,
  } = options

  const [values, setValues] = React.useState<T>(initialValues)
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = React.useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Validate the form values against the schema
  const validateForm = React.useCallback(() => {
    if (!validationSchema) return true

    try {
      validationSchema.parse(values)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Partial<Record<keyof T, string>> = {}
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            const field = err.path[0] as keyof T
            formattedErrors[field] = err.message
          }
        })
        setErrors(formattedErrors)
      }
      return false
    }
  }, [values, validationSchema])

  // Validate a single field
  const validateField = React.useCallback(
    (field: keyof T, value: any) => {
      if (!validationSchema) return true

      try {
        // Create a partial schema just for this field
        const fieldSchema = z.object({ [field]: validationSchema.shape[field] })
        fieldSchema.parse({ [field]: value })
        
        // Clear the error for this field
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
        
        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(prev => ({
            ...prev,
            [field]: error.errors[0]?.message || 'Invalid value',
          }))
        }
        return false
      }
    },
    [validationSchema]
  )

  // Handle form field change
  const handleChange = React.useCallback(
    (field: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [field]: value }))
      
      if (validateOnChange) {
        validateField(field, value)
      }
      
      // Mark as touched on change
      if (!touched[field]) {
        setTouched(prev => ({ ...prev, [field]: true }))
      }
    },
    [validateOnChange, validateField, touched]
  )

  // Handle form field blur
  const handleBlur = React.useCallback(
    (field: keyof T) => {
      setTouched(prev => ({ ...prev, [field]: true }))
      
      if (validateOnBlur) {
        validateField(field, values[field])
      }
    },
    [validateOnBlur, validateField, values]
  )

  // Handle form submission
  const handleSubmit = React.useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      )
      setTouched(allTouched)
      
      const isValid = validateForm()
      
      if (isValid) {
        setIsSubmitting(true)
        try {
          await onSubmit(values)
          return true
        } catch (error) {
          console.error('Form submission error:', error)
          return false
        } finally {
          setIsSubmitting(false)
        }
      }
      
      return false
    },
    [values, validateForm, onSubmit]
  )

  // Reset the form to initial values
  const reset = React.useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  // Set specific form field value
  const setValue = React.useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }, [])

  // Set a specific error
  const setError = React.useCallback((field: keyof T, error: string | null) => {
    setErrors(prev => {
      if (error === null) {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      }
      return { ...prev, [field]: error }
    })
  }, [])

  // Set a field as touched/untouched
  const setFieldTouched = React.useCallback((field: keyof T, isTouched: boolean) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }))
  }, [])

  // Compute if the form is valid
  const isValid = React.useMemo(() => {
    return Object.keys(errors).length === 0 && Object.keys(touched).length > 0
  }, [errors, touched])

  // Form state
  const state: FormState<T> = {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
  }

  // Form handlers
  const handlers: FormHandler<T> = {
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setValue,
    setError,
    setTouched: setFieldTouched,
  }

  return [state, handlers]
}
