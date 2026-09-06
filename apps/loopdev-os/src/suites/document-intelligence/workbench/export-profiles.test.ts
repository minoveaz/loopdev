import { describe, expect, it } from 'vitest';

import {
  buildSurnames,
  DEFAULT_EXPORT_PROFILE_ID,
  formatFieldsForProfile,
  getExportProfile,
  splitSurnames,
} from './export-profiles';

describe('document extraction export profiles', () => {
  it('defaults to the separated-surname insurer profile', () => {
    expect(DEFAULT_EXPORT_PROFILE_ID).toBe('aseguradora-1');
    expect(getExportProfile(DEFAULT_EXPORT_PROFILE_ID).fields.map(({ field }) => field)).toContain(
      'firstSurname',
    );
  });

  it('keeps grouped and separated surname representations synchronized', () => {
    expect(splitSurnames('DE LA ROSA GOMEZ')).toEqual({
      firstSurname: 'DE LA ROSA',
      secondSurname: 'GOMEZ',
    });
    expect(buildSurnames('DE LA ROSA', 'GOMEZ')).toBe('DE LA ROSA GOMEZ');
  });

  it('formats only the fields selected by the active profile', () => {
    const fields = {
      documentType: 'spanish-dni' as const,
      issuingCountry: 'ES',
      fullName: 'María Ejemplo García',
      givenNames: 'María',
      surnames: 'Ejemplo García',
      firstSurname: 'Ejemplo',
      secondSurname: 'García',
      documentNumber: '12345678Z',
      birthDate: '15/03/1990',
      nationality: 'ES',
      sex: 'F',
      issueDate: '02/01/2021',
      expiryDate: '02/01/2031',
      birthplace: null,
      supportNumber: null,
      address: null,
      mrz: null,
    };

    const separated = formatFieldsForProfile(fields, 'aseguradora-1');
    const grouped = formatFieldsForProfile(fields, 'aseguradora-2');

    expect(separated).toContain('Primer apellido: Ejemplo');
    expect(separated).toContain('Segundo apellido: García');
    expect(separated).not.toContain('Apellidos: Ejemplo García');
    expect(grouped).toContain('Apellidos: Ejemplo García');
    expect(grouped).not.toContain('Primer apellido: Ejemplo');
  });
});
