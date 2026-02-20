"""Utility to standardize SEO meta tags and structured data across HTML pages."""
from __future__ import annotations

import copy
import html
import json
import pathlib
import re
from dataclasses import dataclass, field

BASE_DIR = pathlib.Path(__file__).resolve().parent.parent
OG_IMAGE = "https://ausindbridge.org/images/LogoHz.png"
TODAY = "2026-02-04"

ORG_TEMPLATE = {
    "@type": "Organization",
    "@id": "https://ausindbridge.org/#organization",
    "name": "AusInd Bridge Foundation",
    "url": "https://ausindbridge.org/",
    "logo": OG_IMAGE,
    "foundingDate": "2010-01-01",
    "foundingLocation": "Melbourne, Australia",
    "description": (
        "AusInd Bridge Foundation strengthens Australia–India relations through diplomacy, "
        "bilateral trade, strategic policy dialogue, and community impact initiatives."
    ),
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Level 27, 101 Collins Street",
        "addressLocality": "Melbourne",
        "addressRegion": "VIC",
        "postalCode": "3000",
        "addressCountry": "Australia",
    },
    "contactPoint": [
        {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "email": "info@ausindbridge.org",
            "telephone": "+61-3-8680-2586",
            "areaServed": ["AU", "IN"],
            "availableLanguage": ["English", "Hindi"],
        }
    ],
    "areaServed": ["Australia", "India"],
    "sameAs": [
        "https://www.linkedin.com/company/ausindbridgeorg",
    ],
}

WEBSITE_TEMPLATE = {
    "@type": "WebSite",
    "@id": "https://ausindbridge.org/#website",
    "url": "https://ausindbridge.org/",
    "name": "AusInd Bridge Foundation",
    "publisher": {"@id": "https://ausindbridge.org/#organization"},
    "inLanguage": "en",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ausindbridge.org/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
    },
}

# RESPONSIVE_STYLESHEET = "    <link rel=\"stylesheet\" href=\"css/responsive-media.css\">"


@dataclass
class PageMeta:
    file_name: str
    title: str
    description: str
    keywords: str
    canonical: str
    schema_type: str
    breadcrumb: list[tuple[str, str]]
    schema_name: str | None = None
    date_published: str = "2024-01-01"
    date_modified: str = TODAY

    def canonical_id_base(self) -> str:
        cleaned = self.canonical.rstrip('/')
        if cleaned == "https://ausindbridge.org":
            return "https://ausindbridge.org/"
        return cleaned

    def meta_block(self) -> str:
        title_text = html.escape(self.title)
        desc_text = html.escape(self.description)
        keywords_text = html.escape(self.keywords)
        canonical_text = html.escape(self.canonical)
        og_type = "website"
        lines = [
            f"    <title>{title_text}</title>",
            f"    <meta name=\"description\" content=\"{desc_text}\">",
            f"    <meta name=\"keywords\" content=\"{keywords_text}\">",
            f"    <link rel=\"canonical\" href=\"{canonical_text}\">",
            RESPONSIVE_STYLESHEET,
            "    <meta name=\"robots\" content=\"index, follow\">",
            "    <meta name=\"author\" content=\"AusInd Bridge Foundation\">",
            "    <meta name=\"publisher\" content=\"AusInd Bridge Foundation\">",
            "    <meta property=\"og:site_name\" content=\"AusInd Bridge Foundation\">",
            "    <meta property=\"og:locale\" content=\"en_AU\">",
            f"    <meta property=\"og:type\" content=\"{og_type}\">",
            f"    <meta property=\"og:title\" content=\"{title_text}\">",
            f"    <meta property=\"og:description\" content=\"{desc_text}\">",
            f"    <meta property=\"og:url\" content=\"{canonical_text}\">",
            f"    <meta property=\"og:image\" content=\"{OG_IMAGE}\">",
            "    <meta property=\"og:image:alt\" content=\"AusInd Bridge Foundation logo\">",
            "    <meta name=\"twitter:card\" content=\"summary_large_image\">",
            f"    <meta name=\"twitter:title\" content=\"{title_text}\">",
            f"    <meta name=\"twitter:description\" content=\"{desc_text}\">",
            f"    <meta name=\"twitter:image\" content=\"{OG_IMAGE}\">",
        ]
        schema_block = self.schema_block()
        lines.append(schema_block)
        return "\n".join(lines) + "\n"

    def schema_block(self) -> str:
        schema_json = json.dumps(self.schema_graph(), ensure_ascii=False, indent=2)
        return "    <script type=\"application/ld+json\">\n" + schema_json + "\n    </script>"

    def schema_graph(self) -> dict:
        graph = [copy.deepcopy(ORG_TEMPLATE), copy.deepcopy(WEBSITE_TEMPLATE)]
        page_name = (self.schema_name or self.title.split('|')[0]).strip()
        topic_terms = [kw.strip() for kw in self.keywords.split(',') if kw.strip()]
        page_obj = {
            "@type": self.schema_type,
            "@id": f"{self.canonical_id_base()}#webpage",
            "url": self.canonical,
            "name": page_name,
            "description": self.description,
            "inLanguage": "en",
            "datePublished": self.date_published,
            "dateModified": self.date_modified,
            "isPartOf": {"@id": "https://ausindbridge.org/#website"},
            "publisher": {"@id": "https://ausindbridge.org/#organization"},
            "primaryImageOfPage": {"@type": "ImageObject", "url": OG_IMAGE},
        }
        if topic_terms:
            page_obj["about"] = topic_terms
        graph.append(page_obj)

        breadcrumb_items = []
        for idx, (name, url) in enumerate(self.breadcrumb, start=1):
            breadcrumb_items.append(
                {
                    "@type": "ListItem",
                    "position": idx,
                    "name": name,
                    "item": url,
                }
            )
        graph.append(
            {
                "@type": "BreadcrumbList",
                "@id": f"{self.canonical_id_base()}#breadcrumb",
                "itemListElement": breadcrumb_items,
            }
        )

        return {"@context": "https://schema.org", "@graph": graph}


PAGES: list[PageMeta] = [
    PageMeta(
        file_name="home.html",
        title="AusInd Bridge Foundation ",
        description=(
            "AusInd Bridge Foundation convenes Australian and Indian leaders to advance diplomacy, "
            "bilateral trade, strategic policy dialogue, and community impact programs."
        ),
        keywords="AusInd Bridge Foundation, Australia India relations, bilateral engagement, diplomacy, trade missions, cultural exchange, strategic partnership",
        canonical="https://ausindbridge.org/",
        schema_type="WebPage",
        breadcrumb=[("Home", "https://ausindbridge.org/")],
        schema_name="AusInd Bridge Foundation",
    ),
    # PageMeta(
    #     file_name="index.html",
    #     title="AusInd Bridge Foundation | Building the Australia–India Partnership",
    #     description=(
    #         "AusInd Bridge Foundation convenes Australian and Indian leaders to advance diplomacy, "
    #         "bilateral trade, strategic policy dialogue, and community impact programs."
    #     ),
    #     keywords="AusInd Bridge Foundation, Australia India relations, bilateral engagement, diplomacy, trade missions, cultural exchange, strategic partnership",
    #     canonical="https://ausindbridge.org/",
    #     schema_type="WebPage",
    #     breadcrumb=[("Home", "https://ausindbridge.org/")],
    #     schema_name="AusInd Bridge Foundation",
    # ),
    
    PageMeta(
        file_name="about-us.html",
        title="About-Us | AusInd Bridge Foundation ",
        description=(
            "Discover the mission, governance, and leadership alliances that enable AusInd Bridge Foundation to build enduring Australia–India partnerships."
        ),
        keywords="About AusInd Bridge, mission, leadership council, governance, Australia India cooperation",
        canonical="https://ausindbridge.org/about-us",
        schema_type="AboutPage",
        breadcrumb=[
            ("Home", "https://ausindbridge.org/"),
            ("About Us", "https://ausindbridge.org/about-us"),
        ],
        schema_name="About AusInd Bridge Foundation",
    ),
   
    PageMeta(
        file_name="bilateral-trade-business.html",
        title="Bilateral Trade & Business | AusInd Bridge Foundation",
        description=(
            "Explore trade missions, investment facilitation, and market intelligence programs that unlock two-way growth for Australian and Indian enterprises."
        ),
        keywords="Australia India trade, investment facilitation, business missions, market access, bilateral commerce",
        canonical="https://ausindbridge.org/bilateral-trade-business",
        schema_type="CollectionPage",
        breadcrumb=[
            ("Home", "https://ausindbridge.org/"),
            ("Bilateral Trade & Business", "https://ausindbridge.org/bilateral-trade-business"),
        ],
        schema_name="Bilateral Trade & Business",
    ),
    # PageMeta(
    #     file_name="charitable-impact.html",
    #     title="Charitable Causes & Social Impact | AusInd Bridge Foundation",
    #     description=(
    #         "Education, healthcare, environmental, and community development initiatives delivering measurable social impact across Australia and India."
    #     ),
    #     keywords="charitable causes, social impact, philanthropy, education access, community development",
    #     canonical="https://ausindbridge.org/charitable-impact",
    #     schema_type="CollectionPage",
    #     breadcrumb=[
    #         ("Home", "https://ausindbridge.org/"),
    #         ("Charitable Impact", "https://ausindbridge.org/charitable-impact"),
    #     ],
    #     schema_name="Charitable Impact",
    # ),
    PageMeta(
        file_name="charitable-social-impact.html",
        title="Social & Community Impact Programs | AusInd Bridge Foundation",
        description=(
            "Social innovation programs empowering communities with education, health, sustainability, and resilience across the Australia–India corridor."
        ),
        keywords="social impact, community programs, sustainability, education initiatives, AusInd Bridge",
        canonical="https://ausindbridge.org/charitable-social-impact",
        schema_type="CollectionPage",
        breadcrumb=[
            ("Home", "https://ausindbridge.org/"),
            ("Social Impact", "https://ausindbridge.org/charitable-social-impact"),
        ],
        schema_name="Social & Community Impact",
    ),
    # PageMeta(
    #     file_name="contact.html",
    #     title="Contact AusInd Bridge Foundation | Melbourne & New Delhi",
    #     description=(
    #         "Connect with AusInd Bridge Foundation’s Melbourne headquarters and New Delhi office for partnerships, media, and programme enquiries."
    #     ),
    #     keywords="contact AusInd Bridge, Melbourne office, New Delhi office, partnerships, enquiries",
    #     canonical="https://ausindbridge.org/contact",
    #     schema_type="ContactPage",
    #     breadcrumb=[
    #         ("Home", "https://ausindbridge.org/"),
    #         ("Contact", "https://ausindbridge.org/contact"),
    #     ],
    #     schema_name="Contact AusInd Bridge Foundation",
    # ),
    PageMeta(
        file_name="contact-us.html",
        title="Contact-Us | AusInd Bridge Foundation ",
        description=(
            "Reach the AusInd Bridge Foundation team for collaboration proposals, strategic partnerships, and community impact opportunities."
        ),
        keywords="contact AusInd Bridge, Melbourne headquarters, India liaison office, strategic partnerships",
        canonical="https://ausindbridge.org/contact-us",
        schema_type="ContactPage",
        breadcrumb=[
            ("Home", "https://ausindbridge.org/"),
            ("Contact Us", "https://ausindbridge.org/contact-us"),
        ],
        schema_name="Contact AusInd Bridge Foundation",
    ),
    PageMeta(
        file_name="disclaimer.html",
        title="Disclaimer | AusInd Bridge Foundation",
        description="Review the disclaimer outlining acceptable use, liability limits, and content accuracy for AusInd Bridge Foundation digital properties.",
        keywords="AusInd Bridge disclaimer, website disclaimer, liability statement, acceptable use",
        canonical="https://ausindbridge.org/disclaimer",
        schema_type="WebPage",
        breadcrumb=[
            ("Home", "https://ausindbridge.org/"),
            ("Disclaimer", "https://ausindbridge.org/disclaimer"),
        ],
        schema_name="Disclaimer",
    ),
    PageMeta(
        file_name="news.html",
        title="News | AusInd Bridge Foundation",
        description="Latest announcements, delegations, and impact stories from AusInd Bridge Foundation across Australia and India.",
        keywords="AusInd Bridge news, Australia India updates, events, media releases",
        canonical="https://ausindbridge.org/news",
        schema_type="CollectionPage",
        breadcrumb=[
            ("Home", "https://ausindbridge.org/"),
            ("News", "https://ausindbridge.org/news"),
        ],
        schema_name="News & Updates",
    ),
    PageMeta(
        file_name="Political-strategic-engagement.html",
        title="Political & Strategic Engagement | AusInd Bridge Foundation",
        description="Policy dialogues, institutional partnerships, and strategic engagement strengthening Australia–India diplomatic ties.",
        keywords="political engagement, strategic diplomacy, policy dialogue, Australia India relations",
        canonical="https://ausindbridge.org/political-strategic-engagement",
        schema_type="CollectionPage",
        breadcrumb=[
            ("Home", "https://ausindbridge.org/"),
            ("Political & Strategic Engagement", "https://ausindbridge.org/political-strategic-engagement"),
        ],
        schema_name="Political & Strategic Engagement",
    ),
    
    PageMeta(
        file_name="privacy-policy.html",
        title="Privacy Policy | AusInd Bridge Foundation",
        description="Understand how AusInd Bridge Foundation collects, uses, and protects personal information shared with our organisation.",
        keywords="privacy policy, data protection, personal information, AusInd Bridge privacy",
        canonical="https://ausindbridge.org/privacy-policy",
        schema_type="PrivacyPolicy",
        breadcrumb=[
            ("Home", "https://ausindbridge.org/"),
            ("Privacy Policy", "https://ausindbridge.org/privacy-policy"),
        ],
        schema_name="Privacy Policy",
    ),
    
    PageMeta(
        file_name="team.html",
        title="Team | AusInd Bridge Foundation",
        description="Meet the board, advisors, and operational leaders driving AusInd Bridge Foundation’s Australia–India initiatives.",
        keywords="leadership team, board members, advisors, AusInd Bridge staff",
        canonical="https://ausindbridge.org/team",
        schema_type="AboutPage",
        breadcrumb=[
            ("Home", "https://ausindbridge.org/"),
            ("Team", "https://ausindbridge.org/team"),
        ],
        schema_name="Leadership Team",
    ),
    PageMeta(
        file_name="terms-and-conditions.html",
        title="Terms & Conditions | AusInd Bridge Foundation",
        description="Review the terms, acceptable use policies, and legal obligations that govern access to AusInd Bridge Foundation services.",
        keywords="terms and conditions, acceptable use, legal terms, AusInd Bridge",
        canonical="https://ausindbridge.org/terms-and-conditions",
        schema_type="TermsOfService",
        breadcrumb=[
            ("Home", "https://ausindbridge.org/"),
            ("Terms & Conditions", "https://ausindbridge.org/terms-and-conditions"),
        ],
        schema_name="Terms & Conditions",
    ),
    PageMeta(
        file_name="transparency-disclosure.html",
        title="Transparency & Disclosure | AusInd Bridge Foundation",
        description="Financial accountability, governance practices, and transparency disclosures for AusInd Bridge Foundation.",
        keywords="transparency, disclosures, governance, accountability, AusInd Bridge",
        canonical="https://ausindbridge.org/transparency-disclosure",
        schema_type="Report",
        breadcrumb=[
            ("Home", "https://ausindbridge.org/"),
            ("Transparency & Disclosure", "https://ausindbridge.org/transparency-disclosure"),
        ],
        schema_name="Transparency & Disclosure",
    ),
]


REMOVAL_PATTERNS = [
    r"\s*<meta[^>]+name=\"description\"[^>]*>\s*",
    r"\s*<meta[^>]+name=\"keywords\"[^>]*>\s*",
    r"\s*<meta[^>]+name=\"robots\"[^>]*>\s*",
    r"\s*<meta[^>]+name=\"author\"[^>]*>\s*",
    r"\s*<meta[^>]+name=\"publisher\"[^>]*>\s*",
    r"\s*<meta[^>]+name=\"theme-color\"[^>]*>\s*",
    r"\s*<meta[^>]+property=\"og:[^\"]+\"[^>]*>\s*",
    r"\s*<meta[^>]+name=\"twitter:[^\"]+\"[^>]*>\s*",
    r"\s*<link[^>]+rel=\"canonical\"[^>]*>\s*",
    r"\s*<link[^>]+href=\"css/responsive-media\.css\"[^>]*>\s*",
    r"\s*<style[^>]+id=\"global-responsive-media\"[^>]*>.*?</style>\s*",
    r"\s*<script[^>]+type=\"application/ld\+json\"[^>]*>.*?</script>\s*",
]

TITLE_PATTERN = re.compile(r"<title>.*?</title>", re.IGNORECASE | re.DOTALL)


def strip_existing(content: str) -> str:
    for pattern in REMOVAL_PATTERNS:
        content = re.sub(pattern, "\n", content, flags=re.IGNORECASE | re.DOTALL)
    return content


def insert_meta_block(content: str, block: str) -> str:
    match = TITLE_PATTERN.search(content)
    if not match:
        raise ValueError("No <title> tag found.")
    replaced = TITLE_PATTERN.sub(block.split('\n', 1)[0], content, count=1)
    # After replacing title, insert the remainder of block right after title tag
    new_title_match = TITLE_PATTERN.search(replaced)
    if not new_title_match:
        raise ValueError("Title replacement failed.")
    insert_pos = new_title_match.end()
    return replaced[:insert_pos] + "\n" + "\n".join(block.split('\n')[1:]) + "\n" + replaced[insert_pos:]


def apply_meta(page: PageMeta) -> None:
    file_path = BASE_DIR / page.file_name
    content = file_path.read_text(encoding="utf-8")
    content = strip_existing(content)
    content = TITLE_PATTERN.sub(lambda _: f"<title>{html.escape(page.title)}</title>", content, count=1)
    block = page.meta_block()
    content = insert_meta_block(content, block)
    content = re.sub(r"\n{3,}", "\n\n", content)
    file_path.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"Updated {page.file_name}")


def main() -> None:
    for meta in PAGES:
        apply_meta(meta)


if __name__ == "__main__":
    main()
