import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // const datasetPath = path.join(process.cwd(), '..', 'dataset_web_jpeg');
    const datasetPath = path.join(process.cwd(), 'public', 'jpegs')
    const files = fs.readdirSync(datasetPath).filter(file => file.endsWith('.jpg'));
    
    return NextResponse.json({ images: files });
  } catch (error) {
    console.error('Error reading images:', error);
    return NextResponse.json({ error: 'Failed to read images' }, { status: 500 });
  }
}

