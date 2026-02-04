<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
	<xsl:output method="html" encoding="UTF-8" />

	<xsl:template match="/">
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Sitemap | AusInd Bridge Foundation</title>
				<style>
					:root {
						color-scheme: light;
						font-family: Inter, system-ui, -apple-system, Segoe UI, sans-serif;
						background: #ffffff;
						color: #0f172a;
					}
					body {
						margin: 0;
						padding: 48px 20px;
					}
					.container {
						max-width: 860px;
						margin: 0 auto;
					}
					h1 {
						font-size: 28px;
						margin: 0 0 12px;
					}
					p {
						margin: 0 0 24px;
						color: #475569;
					}
					ul {
						list-style: none;
						padding: 0;
						margin: 0;
						display: grid;
						grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
						gap: 8px 18px;
					}
					.item {
						padding: 6px 0;
					}
					.item-title {
						font-weight: 600;
						margin-bottom: 4px;
						color: #0f172a;
					}
					a {
						color: #0c2340;
						text-decoration: none;
						border-bottom: 1px solid transparent;
						padding: 6px 0;
						display: inline-block;
						word-break: break-word;
					}
					a:hover {
						border-bottom-color: #0c2340;
					}
				</style>
			</head>
			<body>
				<div class="container">
					<h1>Sitemap</h1>
					<p>Quick links to the pages listed in this sitemap.</p>
					<ul>
						<xsl:for-each select="sm:urlset/sm:url">
							<li class="item">
								<div class="item-title">
									<xsl:choose>
										<xsl:when test="sm:loc='https://ausindbridge.org/'">Home</xsl:when>
										<xsl:when test="sm:loc='https://ausindbridge.org/about-us'">About Us</xsl:when>
										<xsl:when test="sm:loc='https://ausindbridge.org/team'">Team</xsl:when>
										<xsl:when test="sm:loc='https://ausindbridge.org/news'">News</xsl:when>
										<xsl:when test="sm:loc='https://ausindbridge.org/contact-us'">Contact Us</xsl:when>
										<xsl:when test="sm:loc='https://ausindbridge.org/political-strategic-engagement'">Political &amp; Strategic Engagement</xsl:when>
										<xsl:when test="sm:loc='https://ausindbridge.org/bilateral-trade-business'">Bilateral Trade &amp; Business</xsl:when>
										<xsl:when test="sm:loc='https://ausindbridge.org/charitable-social-impact'">Social &amp; Charitable Impact</xsl:when>
										<xsl:when test="sm:loc='https://ausindbridge.org/privacy-policy'">Privacy Policy</xsl:when>
										<xsl:when test="sm:loc='https://ausindbridge.org/terms-and-conditions'">Terms &amp; Conditions</xsl:when>
										<xsl:when test="sm:loc='https://ausindbridge.org/disclaimer'">Disclaimer</xsl:when>
										<xsl:when test="sm:loc='https://ausindbridge.org/transparency-disclosure'">Transparency &amp; Disclosure</xsl:when>
										<xsl:otherwise>Page</xsl:otherwise>
									</xsl:choose>
								</div>
								<a>
									<xsl:attribute name="href">
										<xsl:value-of select="sm:loc" />
									</xsl:attribute>
									<xsl:value-of select="sm:loc" />
								</a>
							</li>
						</xsl:for-each>
					</ul>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
