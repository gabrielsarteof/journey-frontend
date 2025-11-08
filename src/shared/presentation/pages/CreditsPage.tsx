import { Link } from '@tanstack/react-router'

interface IconCredit {
  name: string
  filename: string
  author: string
  authorUrl?: string
}

const navigationIcons: IconCredit[] = [
  { name: 'Home Icon', filename: 'home.svg', author: 'Author Name' },
  { name: 'User Icon', filename: 'user.svg', author: 'Author Name' },
  { name: 'Menu Icon', filename: 'menu.svg', author: 'Author Name' },
  { name: 'Target Icon', filename: 'target.svg', author: 'Author Name' },
  { name: 'Flag Icon', filename: 'flag.svg', author: 'Author Name' },
  { name: 'Trophy Icon', filename: 'trophy.svg', author: 'Author Name' },
  { name: 'Heart Icon', filename: 'heart.svg', author: 'Author Name' },
  { name: 'Flame Icon', filename: 'flame.svg', author: 'Author Name' },
  { name: 'Gem Icon', filename: 'gem.svg', author: 'Author Name' },
  { name: 'Lock Icon', filename: 'lock.svg', author: 'Author Name' },
  { name: 'Physics Icon', filename: 'physics.svg', author: 'Author Name' },
]

const sidebarIcons: IconCredit[] = [
  { name: 'House Icon', filename: 'house.png', author: 'Author Name' },
  { name: 'Helmet Icon', filename: 'helmet.png', author: 'Author Name' },
  { name: 'Trophy Icon', filename: 'trophy.png', author: 'Author Name' },
  { name: 'Flag Icon', filename: 'flag.png', author: 'Author Name' },
  { name: 'Target Icon', filename: 'target.png', author: 'Author Name' },
  { name: 'Menu Icon', filename: 'menu.png', author: 'Author Name' },
]

const moduleIcons: IconCredit[] = [
  { name: 'Frontend Icon', filename: 'frontend.svg', author: 'Author Name' },
  { name: 'Backend Icon', filename: 'backend.svg', author: 'Author Name' },
  { name: 'Mobile Icon', filename: 'mobile.svg', author: 'Author Name' },
  { name: 'DevOps Icon', filename: 'devops.svg', author: 'Author Name' },
  { name: 'Data Icon', filename: 'data.svg', author: 'Author Name' },
  { name: 'Fullstack Icon', filename: 'fullstack.svg', author: 'Author Name' },
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
            <span className="mr-2">←</span> Voltar
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
