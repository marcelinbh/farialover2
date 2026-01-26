import { storagePut } from './server/storage.js';
import { getDb } from './server/db.js';
import { profiles } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { readFileSync } from 'fs';

const bannerPhotos = [
  { name: 'valentina-reis', file: '/home/ubuntu/farialover/banner-photos-horizontal/valentina-reis-banner.png' },
  { name: 'sofia-bardini', file: '/home/ubuntu/farialover/banner-photos-horizontal/sofia-bardini-banner.png' },
  { name: 'samara', file: '/home/ubuntu/farialover/banner-photos-horizontal/samara-banner.png' },
  { name: 'larissa-reis', file: '/home/ubuntu/farialover/banner-photos-horizontal/larissa-reis-banner.png' },
  { name: 'bruna-alencar', file: '/home/ubuntu/farialover/banner-photos-horizontal/bruna-alencar-banner.png' },
  { name: 'camille-laurent', file: '/home/ubuntu/farialover/banner-photos-horizontal/camille-laurent-banner.png' },
  { name: 'hanna-melo', file: '/home/ubuntu/farialover/banner-photos-horizontal/hanna-melo-banner.png' },
  { name: 'isabela-brito', file: '/home/ubuntu/farialover/banner-photos-horizontal/isabela-brito-banner.png' },
];

async function uploadBannerPhotos() {
  const db = await getDb();
  
  for (const photo of bannerPhotos) {
    try {
      console.log(`Uploading banner photo for ${photo.name}...`);
      
      // Read file
      const fileBuffer = readFileSync(photo.file);
      
      // Upload to S3
      const fileKey = `banners/${photo.name}-${Date.now()}.png`;
      const { url } = await storagePut(fileKey, fileBuffer, 'image/png');
      
      console.log(`Uploaded: ${url}`);
      
      // Update profile in database
      const result = await db.select().from(profiles).where(eq(profiles.name, photo.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))).limit(1);
      
      if (result.length > 0) {
        const profile = result[0];
        await db.update(profiles).set({ photoUrl: url }).where(eq(profiles.id, profile.id));
        console.log(`Updated profile ${profile.name} with new banner photo`);
      } else {
        console.log(`Profile not found for ${photo.name}`);
      }
      
    } catch (error) {
      console.error(`Error uploading ${photo.name}:`, error);
    }
  }
  
  console.log('All banner photos uploaded successfully!');
  process.exit(0);
}

uploadBannerPhotos();
