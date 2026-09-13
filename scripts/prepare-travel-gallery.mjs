import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceRoot = path.resolve("docs/images-to-use");
const outputRoot = path.resolve("public/images/travel");
const manifest = JSON.parse(
  await fs.readFile("src/data/travelPhotos.json", "utf8"),
);

await fs.rm(outputRoot, { recursive: true, force: true });
await fs.mkdir(outputRoot, { recursive: true });

for (const photo of manifest) {
  const source = path.resolve(sourceRoot, photo.source);
  if (!source.startsWith(`${sourceRoot}${path.sep}`)) {
    throw new Error(`Invalid travel-photo source: ${photo.source}`);
  }

  await fs.access(source);

  await sharp(source)
    .rotate()
    .resize({
      width: 1800,
      height: 1800,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(path.join(outputRoot, `${photo.slug}.webp`));

  await sharp(source)
    .rotate()
    .resize({
      width: 720,
      height: 720,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 86, effort: 6, smartSubsample: true })
    .toFile(path.join(outputRoot, `${photo.slug}-thumb.webp`));
}

const files = await fs.readdir(outputRoot);
const totalBytes = (
  await Promise.all(files.map((file) => fs.stat(path.join(outputRoot, file))))
).reduce((total, file) => total + file.size, 0);

console.log(
  `Prepared ${manifest.length} travel photos (${files.length} responsive assets, ${(totalBytes / 1024 / 1024).toFixed(2)} MB).`,
);
