export const dynamic = 'force-static';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      <p className="text-xl mb-8">Static Dashboard Preview</p>
      <p className="mb-4">
        This is a static preview of the dashboard. Dynamic features require server functionality.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i}
            className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">Sample Project {i + 1}</h2>
            <p className="text-gray-600 mb-4">This is a placeholder project card</p>
          </div>
        ))}
      </div>
    </div>
  );
}