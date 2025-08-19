module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_RAILWAY_DOCS_URL || "https://docs.railway.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/dynamic/*'],
  transform: async (config, path) => {
    let priority = 0.5;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    else if (path === '/quick-start') {
      priority = 0.9;
      changefreq = 'weekly';
    }
    else if (path.startsWith('/guides/')) {
      priority = 0.8;
      changefreq = 'weekly';
    }
    else if (path.startsWith('/reference/')) {
      priority = 0.7;
      changefreq = 'monthly';
    }
    else if (path.startsWith('/tutorials/')) {
      priority = 0.8;
      changefreq = 'weekly';
    }
    else if (path.startsWith('/overview/')) {
      priority = 0.8;
      changefreq = 'weekly';
    }
    else if (path.startsWith('/migration/')) {
      priority = 0.7;
      changefreq = 'monthly';
    }
    else if (path.startsWith('/maturity/')) {
      priority = 0.6;
      changefreq = 'monthly';
    }
    else if (path.startsWith('/community/')) {
      priority = 0.6;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dynamic/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_RAILWAY_DOCS_URL || "https://docs.railway.com"}/sitemap.xml`,
    ],
  },
};
