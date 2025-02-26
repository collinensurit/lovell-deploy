import { 
  getFileExtension, 
  getMimeTypeFromExtension,
  FILE_TYPES,
  FILE_SIZE_LIMITS
} from '../types'

describe('File type utilities', () => {
  describe('getFileExtension', () => {
    it('should extract extension from filename', () => {
      expect(getFileExtension('image.jpg')).toBe('jpg')
      expect(getFileExtension('document.pdf')).toBe('pdf')
      expect(getFileExtension('archive.tar.gz')).toBe('gz')
      expect(getFileExtension('noextension')).toBe('')
      expect(getFileExtension('.hiddenfile')).toBe('hiddenfile')
      expect(getFileExtension('file.with.multiple.dots')).toBe('dots')
    })

    it('should handle paths correctly', () => {
      expect(getFileExtension('/path/to/image.png')).toBe('png')
      expect(getFileExtension('C:\\Windows\\file.txt')).toBe('txt')
    })

    it('should return lowercase extension', () => {
      expect(getFileExtension('IMAGE.JPG')).toBe('jpg')
      expect(getFileExtension('Document.PDF')).toBe('pdf')
    })
  })

  describe('getMimeTypeFromExtension', () => {
    it('should return correct MIME type for common extensions', () => {
      expect(getMimeTypeFromExtension('jpg')).toBe('image/jpeg')
      expect(getMimeTypeFromExtension('jpeg')).toBe('image/jpeg')
      expect(getMimeTypeFromExtension('png')).toBe('image/png')
      expect(getMimeTypeFromExtension('pdf')).toBe('application/pdf')
      expect(getMimeTypeFromExtension('txt')).toBe('text/plain')
    })

    it('should be case insensitive', () => {
      expect(getMimeTypeFromExtension('JPG')).toBe('image/jpeg')
      expect(getMimeTypeFromExtension('PDF')).toBe('application/pdf')
    })

    it('should return null for unknown extensions', () => {
      expect(getMimeTypeFromExtension('unknown')).toBeNull()
      expect(getMimeTypeFromExtension('')).toBeNull()
    })
  })

  describe('FILE_TYPES', () => {
    it('should define common file type groups', () => {
      expect(FILE_TYPES.IMAGES).toContain('image/jpeg')
      expect(FILE_TYPES.IMAGES).toContain('image/png')
      
      expect(FILE_TYPES.DOCUMENTS).toContain('application/pdf')
      expect(FILE_TYPES.DOCUMENTS).toContain('text/plain')
      
      expect(FILE_TYPES.AUDIO).toContain('audio/mpeg')
      expect(FILE_TYPES.VIDEO).toContain('video/mp4')
    })
  })

  describe('FILE_SIZE_LIMITS', () => {
    it('should define common file size limits', () => {
      expect(FILE_SIZE_LIMITS.IMAGE).toBeGreaterThan(0)
      expect(FILE_SIZE_LIMITS.DOCUMENT).toBeGreaterThan(0)
      expect(FILE_SIZE_LIMITS.VIDEO).toBeGreaterThan(FILE_SIZE_LIMITS.IMAGE)
    })
  })
})
