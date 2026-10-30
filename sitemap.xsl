<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>XML Sitemap Â· ClerQ Intelligence</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
        <style>
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            background-color: #0a0a0a;
            color: #e5e5e5;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            padding: 2.5rem 1.5rem;
            min-height: 100vh;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
          }
          header {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 2rem;
            margin-bottom: 2.5rem;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.25rem;
          }
          .brand a {
            display: inline-flex;
            align-items: center;
            text-decoration: none;
          }
          .brand svg, .brand img {
            height: 28px;
            width: auto;
          }
          h1 {
            font-size: 1.75rem;
            font-weight: 500;
            color: #ffffff;
            letter-spacing: -0.02em;
            margin-bottom: 0.5rem;
          }
          .lead {
            color: #888888;
            font-size: 0.95rem;
            max-width: 680px;
          }
          .lead a {
            color: #ffffff;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .stats {
            display: inline-flex;
            gap: 1.5rem;
            margin-top: 1.25rem;
            padding: 0.6rem 1rem;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 6px;
            font-size: 0.85rem;
            color: #aaaaaa;
          }
          .stats strong {
            color: #ffffff;
            font-weight: 600;
          }
          .table-wrap {
            background: #111111;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          th {
            background: #161616;
            color: #888888;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 0.85rem 1.25rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          td {
            padding: 1rem 1.25rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            color: #cccccc;
            vertical-align: middle;
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:hover td {
            background: rgba(255, 255, 255, 0.02);
          }
          .loc-link {
            color: #ffffff;
            text-decoration: none;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.88rem;
            word-break: break-all;
            transition: color 0.15s ease;
          }
          .loc-link:hover {
            color: #4ade80;
            text-decoration: underline;
          }
          .badge {
            display: inline-block;
            font-size: 0.78rem;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.06);
            color: #dddddd;
            border: 1px solid rgba(255, 255, 255, 0.08);
          }
          .priority-high {
            background: rgba(74, 222, 128, 0.1);
            color: #4ade80;
            border-color: rgba(74, 222, 128, 0.25);
          }
          footer {
            margin-top: 2.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: #666666;
          }
          footer a {
            color: #888888;
            text-decoration: none;
          }
          footer a:hover {
            color: #ffffff;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="brand">
              <a href="/">
                <img src="/assets/logos/clerq-logotype.svg" alt="ClerQ Intelligence" height="24"/>
              </a>
            </div>
            <h1>XML Sitemap</h1>
            <p class="lead">
              This index contains all public canonical URLs for <strong>ClerQ Intelligence</strong>. It is structured according to the <a href="https://www.sitemaps.org" target="_blank" rel="noopener">sitemaps.org</a> protocol for search engine indexing (Google, Bing) and human navigation.
            </p>
            <div class="stats">
              <span>Total URLs: <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong></span>
              <span>Generated: <strong>2026-09-06</strong></span>
            </div>
          </header>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th style="width: 130px;">Last Modified</th>
                  <th style="width: 120px;">Change Freq</th>
                  <th style="width: 90px; text-align: right;">Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <xsl:sort select="sitemap:priority" order="descending"/>
                  <tr>
                    <td>
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}" class="loc-link">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <span style="color: #888888; font-size: 0.85rem;">
                        <xsl:value-of select="sitemap:lastmod"/>
                      </span>
                    </td>
                    <td>
                      <span class="badge">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </td>
                    <td style="text-align: right;">
                      <xsl:choose>
                        <xsl:when test="sitemap:priority >= 0.9">
                          <span class="badge priority-high"><xsl:value-of select="sitemap:priority"/></span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="badge"><xsl:value-of select="sitemap:priority"/></span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            <span>&#169; 2026 ClerQ Intelligence. All rights reserved.</span>
            <a href="/">Return to Homepage &#8594;</a>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

