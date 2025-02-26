export const dynamic = 'force-static'
export const revalidate = 0

export default function LoginPage() {
  // This is a server component that just renders a basic login page
  // We're purposely simplifying it for Vercel deployment
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">
            Enter your credentials to sign in
          </p>
        </div>

        <div className="space-y-4">
          <form action="/api/auth/login" method="POST" className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-md border p-2"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-md border p-2"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-primary p-2 text-primary-foreground"
            >
              Sign In
            </button>
          </form>

          <div className="text-center text-sm">
            <span>Don&apos;t have an account? </span>
            <a href="/signup" className="underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
