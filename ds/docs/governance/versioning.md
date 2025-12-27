# Versioning — SemVer + Changesets

## SemVer
- **MAJOR (x.0.0):** cambios incompatibles / migración requerida
- **MINOR (0.x.0):** nuevas features compatibles (nuevo componente/variante)
- **PATCH (0.0.x):** fixes compatibles

## Changesets (práctica)
- Cada PR que cambie `packages/ui`, `tokens` o `tailwind-config` añade un changeset.
- Los cambios “breaking” deben incluir guía de migración en el PR y en Storybook.

## Changelog
- `/docs/CHANGELOG.md` refleja cambios relevantes a nivel sistema.
