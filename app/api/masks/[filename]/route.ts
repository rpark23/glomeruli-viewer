// import { NextRequest, NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';
// import sharp from 'sharp';

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { filename: string } }
// ) {
//   try {
//     // Convert jpg filename to png mask filename
//     const jpgFilename = params.filename;
//     const maskFilename = jpgFilename.replace('.jpg', '_mask.png');
    
//     // Paths for both JPEG and mask images
//     const jpegPath = path.join(process.cwd(), 'public', 'jpegs', jpgFilename);
//     const maskPath = path.join(process.cwd(), 'public', 'masks', maskFilename);
    
//     if (!fs.existsSync(maskPath)) {
//       return NextResponse.json({ error: 'Mask not found' }, { status: 404 });
//     }

//     if (!fs.existsSync(jpegPath)) {
//       return NextResponse.json({ error: 'Source JPEG not found' }, { status: 404 });
//     }

//     // Get dimensions of the JPEG image
//     const jpegMetadata = await sharp(jpegPath).metadata();
//     const jpegWidth = jpegMetadata.width;
//     const jpegHeight = jpegMetadata.height;

//     if (!jpegWidth || !jpegHeight) {
//       return NextResponse.json({ error: 'Could not read JPEG dimensions' }, { status: 500 });
//     }

//     // Resize the mask to match the JPEG dimensions exactly
//     const resizedMaskBuffer = await sharp(maskPath)
//       .resize(jpegWidth, jpegHeight, {
//         fit: 'fill', // This ensures exact dimensions match
//         kernel: sharp.kernel.lanczos3
//       })
//       .png()
//       .toBuffer();

//     return new NextResponse(new Blob([Uint8Array.from(resizedMaskBuffer)]), {
//       headers: {
//         'Content-Type': 'image/png',
//         'Cache-Control': 'public, max-age=31536000',
//       },
//     });
//   } catch (error) {
//     console.error('Error serving mask:', error);
//     return NextResponse.json({ error: 'Failed to serve mask' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import path from 'path';
import { readFile } from 'fs/promises';

export async function GET(
  _: Request,
  { params }: { params: { filename: string } }
) {
  try {
    // The mask filename is static, just append "_mask.png"
    const maskFilename = params.filename.replace('.jpg', '_mask.png');

    // Build absolute path to public/masks
    const maskPath = path.join(process.cwd(), 'public', 'masks', maskFilename);

    // Read the file as a buffer
    const fileBuffer = await readFile(maskPath);

    return new NextResponse(new Blob([Uint8Array.from(fileBuffer)]), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving mask:', error);
    return NextResponse.json({ error: 'Mask not found' }, { status: 404 });
  }
}
