import { Link } from '@tanstack/react-router'

interface IconCredit {
  name: string
  filename: string
  author: string
  authorUrl?: string
}

// Example data - Replace with actual icon credits when adding new icons
const navigationIcons: IconCredit[] = [
  {
    name: 'Example Navigation Icon',
    filename: 'example-icon.svg',
    author: 'Author Name',
    authorUrl: 'https://www.flaticon.com/authors/author-name'
  },
]

const sidebarIcons: IconCredit[] = [
  {
    name: 'Example Sidebar Icon',
    filename: 'example-sidebar.png',
    author: 'Author Name',
    authorUrl: 'https://www.flaticon.com/authors/author-name'
  },
]

const moduleIcons: IconCredit[] = [
  {
    name: 'Example Module Icon',
    filename: 'example-module.svg',
    author: 'Author Name',
    authorUrl: 'https://www.flaticon.com/authors/author-name'
  },
]

export function CreditsPage() {
  return (
    <div className="min-h-screen bg-background transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <span className="mr-2">←</span> Back
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">Credits</h1>
          <p className="text-muted text-lg">
            This project uses icons from{' '}
            <a
              href="https://www.flaticon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Flaticon
            </a>
            . Below is the complete list of icons and their respective authors.
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border-secondary">
              Navigation Icons
            </h2>
            <ul className="space-y-3">
              {navigationIcons.map((icon) => (
                <li key={icon.filename} className="text-muted-foreground">
                  <strong className="text-foreground">{icon.name}</strong>{' '}
                  <code className="text-sm bg-surface px-2 py-1 rounded">
                    {icon.filename}
                  </code>{' '}
                  - Designed by{' '}
                  {icon.authorUrl ? (
                    <a
                      href={icon.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {icon.author}
                    </a>
                  ) : (
                    <span className="text-foreground">{icon.author}</span>
                  )}{' '}
                  from{' '}
                  <a
                    href="https://www.flaticon.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Flaticon
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border-secondary">
              Sidebar Icons
            </h2>
            <ul className="space-y-3">
              {sidebarIcons.map((icon) => (
                <li key={icon.filename} className="text-muted-foreground">
                  <strong className="text-foreground">{icon.name}</strong>{' '}
                  <code className="text-sm bg-surface px-2 py-1 rounded">
                    {icon.filename}
                  </code>{' '}
                  - Designed by{' '}
                  {icon.authorUrl ? (
                    <a
                      href={icon.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {icon.author}
                    </a>
                  ) : (
                    <span className="text-foreground">{icon.author}</span>
                  )}{' '}
                  from{' '}
                  <a
                    href="https://www.flaticon.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Flaticon
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border-secondary">
              Module Icons
            </h2>
            <ul className="space-y-3">
              {moduleIcons.map((icon) => (
                <li key={icon.filename} className="text-muted-foreground">
                  <strong className="text-foreground">{icon.name}</strong>{' '}
                  <code className="text-sm bg-surface px-2 py-1 rounded">
                    {icon.filename}
                  </code>{' '}
                  - Designed by{' '}
                  {icon.authorUrl ? (
                    <a
                      href={icon.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {icon.author}
                    </a>
                  ) : (
                    <span className="text-foreground">{icon.author}</span>
                  )}{' '}
                  from{' '}
                  <a
                    href="https://www.flaticon.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Flaticon
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 p-6 bg-surface rounded-lg border border-border-secondary">
          <h3 className="text-lg font-semibold text-foreground mb-2">License Information</h3>
          <p className="text-muted-foreground text-sm">
            These icons are used under the Flaticon Free License, which requires attribution. The
            icons can be renamed and modified according to project needs, as long as proper credit
            is given to the original authors.
          </p>
        </div>
      </div>
    </div>
  )
}
