// Site renderer for `launchJupyter` nodes from the {launch-jupyter} directive.
export default function ASTRenderer({ React, ASTComponent }) {
  const h = React.createElement;

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
            fontSize: '1.6rem',
          },
        },
        '🚀',
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
