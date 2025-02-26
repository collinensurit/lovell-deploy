import { NextResponse } from 'next/server'

// Using static mode for export compatibility
export const dynamic = 'force-static'

// Mock file list for static build
const mockFiles = [
  {
    id: 'file1',
    name: 'Document 1.pdf',
    type: 'pdf',
    size: 245000,
    created_at: '2025-02-20T10:00:00Z',
    updated_at: '2025-02-20T10:00:00Z',
    url: '/mock/document1.pdf'
  },
  {
    id: 'file2',
    name: 'Spreadsheet.xlsx',
    type: 'xlsx',
    size: 125000,
    created_at: '2025-02-19T15:30:00Z',
    updated_at: '2025-02-19T15:30:00Z',
    url: '/mock/spreadsheet.xlsx'
  },
  {
    id: 'file3',
    name: 'Presentation.pptx',
    type: 'pptx',
    size: 1850000,
    created_at: '2025-02-18T09:15:00Z',
    updated_at: '2025-02-18T09:15:00Z',
    url: '/mock/presentation.pptx'
  }
]

export async function GET() {
  return NextResponse.json({
    files: mockFiles,
    message: 'Static mock data: In static export mode, dynamic API routes are not available.'
  })
}
