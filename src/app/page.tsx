export const dynamic = 'force-static';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Lovell</h1>
      <p className="text-xl mb-8">This is a static export of the application.</p>
      <p className="mb-4">
        Dynamic features are not available in this preview mode.
      </p>
      <a 
        href="/dashboard" 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        View Dashboard
      </a>
    </div>
  );
}