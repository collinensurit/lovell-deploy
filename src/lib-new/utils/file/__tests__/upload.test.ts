import { validateFile } from '../upload'

// Mock File class since it's not available in Node.js environment
global.File = class File {
  name: string;
  size: number;
  type: string;

  constructor(bits: any[], name: string, options?: any) {
    this.name = name;
    this.size = bits.reduce((acc, bit) => acc + (bit.length || 0), 0);
    this.type = options?.type || '';
  }
} as any;

describe('File upload utilities', () => {
  describe('validateFile', () => {
    it('should validate files based on size', () => {
      const validFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.txt', { type: 'text/plain' });
      
      expect(validateFile(validFile, { maxSize: 5 * 1024 * 1024 })).toBe(true);
      expect(validateFile(largeFile, { maxSize: 5 * 1024 * 1024 })).toContain('exceeds the maximum size');
    })

    it('should validate files based on allowed types', () => {
      const imageFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
      const pdfFile = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' });
      
      expect(validateFile(imageFile, { allowedTypes: ['image/jpeg', 'image/png'] })).toBe(true);
      expect(validateFile(pdfFile, { allowedTypes: ['image/jpeg', 'image/png'] })).toContain('type is not allowed');
    })

    it('should validate based on both size and type', () => {
      const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const invalidFile = new File(['x'.repeat(6 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' });
      const invalidTypeFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      
      expect(validateFile(validFile, { 
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png']
      })).toBe(true);
      
      expect(validateFile(invalidFile, { 
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png']
      })).toContain('exceeds the maximum size');
      
      expect(validateFile(invalidTypeFile, { 
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png']
      })).toContain('type is not allowed');
    })

    it('should pass validation with no constraints', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      expect(validateFile(file)).toBe(true);
      expect(validateFile(file, {})).toBe(true);
    })
  })
})
