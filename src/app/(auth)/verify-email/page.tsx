export const dynamic = 'force-static'
export const revalidate = 0

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent you an email with a link to verify your account.
            Please check your inbox.
          </p>
        </div>

        <div className="pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive an email? Check your spam folder or
            <a href="/login" className="ml-1 underline">
              return to login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
