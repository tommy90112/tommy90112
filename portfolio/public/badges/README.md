# Certification badges

Badge artwork for the certifications section. `CERTIFICATIONS` in
`src/data/site.ts` points at these by filename.

| File                      | Certification                                   |
| ------------------------- | ----------------------------------------------- |
| `azure_az-900.png`        | Microsoft Certified: Azure Fundamentals          |
| `azure_ai-900.png`        | Microsoft Certified: Azure AI Fundamentals       |
| `SAS_programming_1.png`   | SAS Programming 1: Essentials                    |
| `SAS_programming_2.png`   | SAS Programming 2: Data Manipulation Techniques  |
| `ITS-Badges_ai.png`       | IT Specialist - Artificial Intelligence          |

A missing file is safe: the card falls back to a generic shield icon rather
than rendering a broken image.

## Why self-hosted

Hot-linking `images.credly.com` would make every visitor's browser issue a
request to Credly — handing them the visitor's IP, user agent, and referring
page on a site that otherwise loads no third-party resources. It also puts a
hole in the section whenever their CDN is slow.

The card still links out to the Credly badge page, so the credential stays
verifiable against the issuer.

## Adding another

Save the image here, then add an entry to `CERTIFICATIONS` with its filename.
Badge UUIDs for the `link` field come from the public feed:

    https://www.credly.com/users/yuhung-shih.e36abb06/badges.json

Square PNGs around 340×340 are ideal — the card renders them at 64×64.
