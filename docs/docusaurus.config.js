module.exports = {
  title: 'Test Backend API Documentation',
  tagline: '',
  url: 'https://test-backend.nate-lin.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'llldar', // Usually your GitHub org/user name.
  projectName: 'test-backend', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Test Backend',
      logo: {
        alt: 'Test Backend Logo',
        src: 'img/logo.svg',
      },
      links: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/llldar/test-backend',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Test Backend, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          homePageId: 'GetStarted',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/llldar/test-backend/edit/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
