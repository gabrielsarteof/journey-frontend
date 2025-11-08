# Template for Adding New Flaticon Icons

## How to Add Credits for New Icons

### 1. Download the Icon from Flaticon

When downloading an icon from Flaticon, you will see information such as:
- Author name
- Link to author's profile
- Original filename

### 2. Rename the File (Optional)

You can rename the file following the project's naming convention:
- Use kebab-case (words separated by hyphens)
- Be descriptive
- Examples: `user-profile.svg`, `settings-gear.svg`, `notification-bell.svg`

### 3. Add to CREDITS.md

Open the `CREDITS.md` file and add a new entry in the appropriate section:

```markdown
- **Icon Name** (`filename.svg`) - Designed by [Author Name](author-profile-link) from [Flaticon](https://www.flaticon.com)
```

**Example:**
```markdown
- **Settings Icon** (`settings-gear.svg`) - Designed by [Freepik](https://www.flaticon.com/authors/freepik) from [Flaticon](https://www.flaticon.com)
```

### 4. Update CreditsPage.tsx

If necessary, also add the new icon to the React component at:
`src/shared/presentation/pages/CreditsPage.tsx`

Add a new object in the corresponding array:

```typescript
{
  name: 'Settings Icon',
  filename: 'settings-gear.svg',
  author: 'Freepik',
  authorUrl: 'https://www.flaticon.com/authors/freepik'
}
```

## Complete Example

### Step by step:

1. **Downloaded from Flaticon:**
   - Original file: `2991148.svg`
   - Author: Freepik
   - Link: https://www.flaticon.com/authors/freepik

2. **Renamed to:**
   - `notification-bell.svg`

3. **Added to CREDITS.md:**
```markdown
- **Notification Bell Icon** (`notification-bell.svg`) - Designed by [Freepik](https://www.flaticon.com/authors/freepik) from [Flaticon](https://www.flaticon.com)
```

4. **Added to CreditsPage.tsx:**
```typescript
{
  name: 'Notification Bell Icon',
  filename: 'notification-bell.svg',
  author: 'Freepik',
  authorUrl: 'https://www.flaticon.com/authors/freepik'
}
```

## Important Notes

- **Always** add attribution even if you rename the file
- **Always** include the link to Flaticon
- If possible, include the link to the author's profile
- Maintain organization by categories (Navigation, Sidebar, Module, etc.)
- Attribution is required for Flaticon's free license

## Useful Links

- [Flaticon License](https://www.flaticon.com/legal)
- [Flaticon Attribution Guide](https://support.flaticon.com/s/article/Attribution-How-when-and-where-FI)
- Project credits page: `/credits`
