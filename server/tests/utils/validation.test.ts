import { describe, it, expect } from 'vitest';

import { PhotographSchema, validateRequest } from '../../src/utils/validation';

describe('Validation Utils', () => {
  describe('PhotographSchema', () => {
    const validPhotograph = {
      title: 'Valid Photo',
      photoUrl: 'https://example.com/photo.jpg',
      description: 'A valid photograph',
      author: 'Valid Author',
      position: {
        type: 'Point',
        coordinates: [139.6438652726942, 35.79418736999594]
      }
    };

    it('should validate a correct photograph object', () => {
      expect(() => PhotographSchema.parse(validPhotograph)).not.toThrow();
    });

    it('should accept photograph without description', () => {
      const { description, ...photographWithoutDescription } = validPhotograph;
      expect(() => PhotographSchema.parse(photographWithoutDescription)).not.toThrow();
    });

    describe('title validation', () => {
      it('should reject empty title', () => {
        const invalid = { ...validPhotograph, title: '' };
        expect(() => PhotographSchema.parse(invalid)).toThrow('Title is required');
      });

      it('should reject title that is too long', () => {
        const invalid = { ...validPhotograph, title: 'a'.repeat(201) };
        expect(() => PhotographSchema.parse(invalid)).toThrow('Title too long');
      });
    });

    describe('photoUrl validation', () => {
      it('should reject invalid URLs', () => {
        const invalid = { ...validPhotograph, photoUrl: 'not-a-url' };
        expect(() => PhotographSchema.parse(invalid)).toThrow('Invalid photo URL');
      });

      it('should accept various URL formats', () => {
        const urls = [
          'https://example.com/photo.jpg',
          'http://example.com/photo.png',
          'https://subdomain.example.com/path/to/photo.webp'
        ];

        urls.forEach(url => {
          const photo = { ...validPhotograph, photoUrl: url };
          expect(() => PhotographSchema.parse(photo)).not.toThrow();
        });
      });
    });

    describe('author validation', () => {
      it('should reject empty author', () => {
        const invalid = { ...validPhotograph, author: '' };
        expect(() => PhotographSchema.parse(invalid)).toThrow('Author is required');
      });

      it('should reject author name that is too long', () => {
        const invalid = { ...validPhotograph, author: 'a'.repeat(101) };
        expect(() => PhotographSchema.parse(invalid)).toThrow('Author name too long');
      });
    });

    describe('position validation', () => {
      it('should require Point type', () => {
        const invalid = {
          ...validPhotograph,
          position: {
            type: 'LineString',
            coordinates: [139.6438652726942, 35.79418736999594]
          }
        };
        expect(() => PhotographSchema.parse(invalid)).toThrow();
      });

      it('should validate longitude range', () => {
        const invalidLongitude = {
          ...validPhotograph,
          position: {
            type: 'Point',
            coordinates: [181, 35.79418736999594] // Invalid longitude
          }
        };
        expect(() => PhotographSchema.parse(invalidLongitude)).toThrow();
      });

      it('should validate latitude range', () => {
        const invalidLatitude = {
          ...validPhotograph,
          position: {
            type: 'Point',
            coordinates: [139.6438652726942, 91] // Invalid latitude
          }
        };
        expect(() => PhotographSchema.parse(invalidLatitude)).toThrow();
      });

      it('should accept valid coordinate ranges', () => {
        const validCoordinates = [
          [-180, -90], // Min values
          [180, 90],   // Max values
          [0, 0],      // Zero values
          [-120.5, 45.7] // Decimal values
        ];

        validCoordinates.forEach(coords => {
          const photo = {
            ...validPhotograph,
            position: { type: 'Point', coordinates: coords }
          };
          expect(() => PhotographSchema.parse(photo)).not.toThrow();
        });
      });
    });
  });

  describe('validateRequest', () => {
    const validData = {
      title: 'Test Photo',
      photoUrl: 'https://example.com/test.jpg',
      author: 'Test Author',
      position: {
        type: 'Point',
        coordinates: [139.6438652726942, 35.79418736999594]
      }
    };

    it('should return success for valid data', () => {
      const result = validateRequest(PhotographSchema, validData);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
      expect(result.errors).toBeUndefined();
    });

    it('should return errors for invalid data', () => {
      const invalidData = {
        title: '', // Invalid
        photoUrl: 'not-a-url', // Invalid
        author: '', // Invalid
        position: {
          type: 'Point',
          coordinates: [200, 100] // Invalid coordinates
        }
      };

      const result = validateRequest(PhotographSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toEqual(
        expect.arrayContaining([
          { field: 'title', message: 'Title is required' },
          { field: 'photoUrl', message: 'Invalid photo URL' },
          { field: 'author', message: 'Author is required' }
        ])
      );
    });

    it('should handle nested field errors', () => {
      const invalidData = {
        title: 'Valid Title',
        photoUrl: 'https://example.com/photo.jpg',
        author: 'Valid Author',
        position: {
          type: 'Point',
          coordinates: [181, 91] // Both coordinates invalid
        }
      };

      const result = validateRequest(PhotographSchema, invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ 
            field: expect.stringContaining('position.coordinates'),
            message: expect.any(String)
          })
        ])
      );
    });

    it('should handle non-ZodError exceptions', () => {
      const schemaWithError = {
        parse: () => { throw new Error('Non-Zod error'); }
      };

      const result = validateRequest(schemaWithError as any, validData);
      
      expect(result.success).toBe(false);
      expect(result.errors).toEqual([
        { field: 'unknown', message: 'Validation failed' }
      ]);
    });
  });
});