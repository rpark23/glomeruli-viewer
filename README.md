# Glomeruli Image Viewer

A Next.js application for viewing and analyzing glomeruli images with mask overlay functionality.

## Features

- **Grid View**: Browse all images in a responsive grid layout
- **List View**: Alternative list view for easier scanning
- **Full Page Viewer**: Click any image to view it in full-screen mode
- **Mask Toggle**: Toggle mask overlay on/off (placeholder implementation)
- **Navigation**: Navigate between images using arrow keys or navigation buttons
- **Zoom & Rotate**: Mouse wheel to zoom, double-click to rotate
- **Search**: Search images by filename
- **Download**: Download individual images
- **Keyboard Shortcuts**: 
  - `ESC`: Close viewer
  - `←/→`: Navigate between images
  - `M`: Toggle mask overlay
  - `R`: Reset image (zoom/rotation)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
web/
├── app/
│   ├── api/
│   │   └── images/
│   │       ├── route.ts              # API to list all images
│   │       └── [filename]/
│   │           └── route.ts          # API to serve individual images
│   ├── components/
│   │   ├── ImageViewer.tsx           # Main grid/list view component
│   │   └── FullPageViewer.tsx        # Full-screen image viewer
│   ├── globals.css                   # Global styles and Tailwind imports
│   ├── layout.tsx                    # Root layout component
│   └── page.tsx                      # Main page component
├── package.json
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
└── tsconfig.json                     # TypeScript configuration
```

## API Endpoints

- `GET /api/images` - Returns list of all available images
- `GET /api/images/[filename]` - Serves individual image files

## Customization

### Adding Mask Overlay

The mask toggle functionality is currently a placeholder. To implement actual mask overlay:

1. Create mask images with the same naming convention as the original images
2. Update the `FullPageViewer.tsx` component to load and display mask images
3. Modify the mask overlay logic in the `showMask` condition

### Styling

The application uses Tailwind CSS for styling. You can customize the appearance by:

1. Modifying the classes in the component files
2. Updating `tailwind.config.js` for theme customization
3. Adding custom CSS in `globals.css`

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Performance Notes

- Images are served with caching headers for optimal performance
- Lazy loading is implemented for the grid view
- Images are optimized for web display

## License

This project is part of the glomeruli analysis workflow.
