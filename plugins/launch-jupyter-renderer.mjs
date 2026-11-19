// Site renderer for `launchJupyter` nodes from the {launch-jupyter} directive.

// Lucide "rocket" icon (lucide v0.552.0, ISC license), https://lucide.dev/icons/rocket
const ROCKET_PATHS = [
  'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
  'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
  'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0',
  'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
];

export default function ASTRenderer({ React, ASTComponent }) {
  const h = React.createElement;

  function RocketIcon() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      ...ROCKET_PATHS.map((d) => h('path', { key: d, d })),
    );
  }

  function LaunchJupyter({ node, className }) {
    return h(
      'a',
      {
        href: node.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        className,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '1.5rem 0',
          padding: '1rem 1.25rem',
          border: '1px solid rgba(37, 99, 235, 0.45)',
          borderRadius: '0.75rem',
          background: 'rgba(37, 99, 235, 0.08)',
          color: 'inherit',
          textDecoration: 'none',
        },
      },
      h(
        'span',
        {
          'aria-hidden': true,
          style: {
            flex: 'none',
            display: 'grid',
            placeItems: 'center',
            width: '3rem',
            height: '3rem',
            borderRadius: '9999px',
            background: 'rgba(37, 99, 235, 0.15)',
            color: '#3b82f6',
          },
        },
        h(RocketIcon),
      ),
      h(
        'span',
        { style: { display: 'block', minWidth: 0 } },
        h(
          'span',
          { style: { display: 'block', fontWeight: 700, fontSize: '1.15rem' } },
          node.title,
          ' →',
        ),
        h(
          'span',
          { style: { display: 'block', opacity: 0.8, fontSize: '0.95rem' } },
          h(ASTComponent, { ast: node.children }),
        ),
      ),
    );
  }

  return { launchJupyter: LaunchJupyter };
}
