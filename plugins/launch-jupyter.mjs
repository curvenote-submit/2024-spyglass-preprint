// A {launch-jupyter} directive and its site renderer: a rocket button that
// starts a dedicated Jupyter server on the Frank Lab BinderHub.
//
//   :::{launch-jupyter} Optional title
//   :url: https://...   (optional; defaults to DEFAULT_URL)
//   Optional description (MyST).
//   :::

const DEFAULT_URL =
  'https://hhmi-frank-4eg38zi9.curvenote.dev/v2/gh/curvenote-submit/2024-spyglass-preprint/HEAD' +
  '?urlpath=lab/tree/notebooks/00_Spyglass_Smoke_Test.ipynb';
const DEFAULT_TITLE = 'Launch in Jupyter';
const DEFAULT_DESCRIPTION =
  'Start a dedicated Jupyter server on BinderHub where you can run the notebooks in this tutorial.';

const launchJupyterDirective = {
  name: 'launch-jupyter',
  doc: 'A button that launches the tutorial notebooks on a dedicated BinderHub Jupyter server.',
  arg: { type: String, doc: `Button title (default "${DEFAULT_TITLE}").` },
  options: {
    url: { type: String, doc: 'BinderHub launch URL.' },
  },
  body: { type: 'myst', doc: 'Description shown under the title.' },
  run(data) {
    const children = data.body?.length
      ? data.body
      : [{ type: 'paragraph', children: [{ type: 'text', value: DEFAULT_DESCRIPTION }] }];
    return [
      {
        type: 'launchJupyter',
        url: data.options?.url ?? DEFAULT_URL,
        title: data.arg || DEFAULT_TITLE,
        children,
      },
    ];
  },
};

export default {
  name: 'Launch in Jupyter',
  directives: [launchJupyterDirective],
  renderers: [{ name: 'LaunchJupyter', source: './launch-jupyter-renderer.mjs' }],
};
