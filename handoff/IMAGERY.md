# Imagery and rights

## Current portrait update

The user supplied `docs/john.jpg` and explicitly requested incorporation into the public concepts during design exploration. The 1118 × 1118 original is preserved locally. WebP exports at 1118 and 600 pixels are in `public/images/john-and-wife*.webp`, with metadata stripped during encoding. Faces and photographic content are unaltered. These earlier exports remain available for the booking demonstration; the selected homepage uses the later movie-theater portrait described below.

For Concept One, the user later supplied `docs/IMG_5623.heic`, a 4032 × 3024 movie-theater portrait, and requested a complete background and foreground-plant removal. The project-specific exports are `public/images/john-and-veronica-movies-cutout.webp` (1086 × 1448) and `public/images/john-and-veronica-movies-cutout-small.webp` (600 × 800). Both are lossless WebP files with real alpha transparency and stripped metadata. The source background and vegetation were removed, small occluded lower-body areas were reconstructed, and the final subject mask was alpha-matted and visually checked on the Concept One cream background. The other four concepts retain the earlier supplied portrait.

## Travel gallery

The user supplied and authorized all 33 travel photographs in the numbered subfolders of `docs/images-to-use/`. Their display order and accessible descriptions are recorded in `src/data/travelPhotos.json`. `npm run images:travel` creates a full and thumbnail WebP for each photograph in `public/images/travel/`, applies embedded orientation, strips EXIF/location metadata, preserves the original aspect ratio, and never enlarges a source beyond its available resolution. The source folders remain local and excluded from deployment.

## Initial source-access history

## John C. Small Jr. and Veronica Kouassi Small

The requested Facebook page, https://www.facebook.com/johncsmalljr/photos, could not be fetched through public web access. No authentication, privacy control, or usage restriction was bypassed. No personal photo, download permission, or adequate original resolution was established. No stock or AI portrait was substituted.

Explicitly labeled, non-public composition placeholders are supplied in `handoff/images/`. They are not linked from the website or included in the deployed asset directory, so customer-facing pages do not display production notes or empty photo boxes. The concepts use complete original art/typography instead, pending client photography.

Needed files:

| Placeholder       | Client-supplied image                                                                                                     | Minimum original size                         | Placement and usage                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| john-and-wife.svg | Natural portrait of John C. Small Jr. and Veronica Kouassi Small together; both clearly identifiable; relaxed, warm light | 2400 × 3000 px preferred, 1600 × 2000 minimum | Keepsake editorial portrait, optional story spread; allow a 4:5 crop with safe space around faces |
| john-portrait.svg | Solo portrait of John, facing camera, simple environment                                                                  | 1800 × 2400 px preferred                      | About/contact area; 3:4 crop                                                                      |
| shared-travel.svg | A travel memory showing the couple together or their own travel scene, with location and context approved for publication | 3000 × 2000 px preferred, 2000 × 1333 minimum | Open Horizon wide image and travel narrative; 3:2/16:9 crop                                       |

For each file provide the original download (not a screenshot), photographer/rights holder, written web-publication permission, the subjects' permission, required credit, and approved descriptive caption. Strip unnecessary location/EXIF details before web export. Avoid unauthorized bystanders or imagery implying a specific client outcome.

## Original artwork used

- `public/images/coast.webp` (1536 × 1024), `coast-small.webp` (768 × 512), and `social.jpg` (1200 × 630): original AI-generated coastal study, created with the built-in image-generation tool for this project. Conceptual scenery, no people and no claimed trip/destination. Display caption: “Coastal study · Original digital artwork.” Visually inspected before web optimization. This is not evidence of the company visiting any destination.
- Original source retained locally at `/Users/terrance/.codex/generated_images/01a08389-eda3-7c92-9b4e-01681ca79f64/exec-8d1a4a00-d5c3-4641-a931-8a45e6903624.png`.
- `src/components/Art.astro`: original code-native botanical rosette, route/topographic illustration and arch motif. No third-party image license required for these newly authored illustrations.
- `public/images/preview-*.webp`: screenshots of the implemented concepts, captured by the project QA script.
- Fonts: self-hosted Fontsource packages (DM Sans, Cormorant Garamond, Manrope, Fraunces, IBM Plex Mono, Space Grotesk). License notices are copied to `handoff/font-licenses/`.

Generation prompt: “Use case: photorealistic-natural. Asset type: panoramic editorial website landscape for a thoughtful travel and life-transition consultancy. Create a beautifully composed aerial coastal photograph, secluded warm ivory sand beach curves from lower left toward distant center right, deep blue teal ocean on right, softly textured dune grasses left, gentle wave lines, early morning natural sunlight. Fine art travel magazine, real natural textures, subtle analog film character, peaceful and expansive, palette deep ocean blue, sea glass, warm sand, no people, no buildings, no boats, no identifiable destination, no text or lettering or logo. Wide landscape 3:2 or wider, high resolution, main land features left with expansive sea right. This is a conceptual scenic image, not a photograph of any real client trip.”
