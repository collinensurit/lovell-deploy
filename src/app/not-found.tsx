import Link from 'next/link'
import { FileSearch } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1E1E1E] text-[#D4D4D4]">
      <div className="space-y-6 text-center">
        <FileSearch size={64} className="mx-auto text-[#007ACC]" />
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-xl">
          The requested page could not be located in this workspace.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="rounded-md bg-[#007ACC] px-4 py-2 text-white hover:bg-[#005A9E] focus:outline-none focus:ring-2 focus:ring-[#007ACC] focus:ring-offset-2 focus:ring-offset-[#1E1E1E]"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
