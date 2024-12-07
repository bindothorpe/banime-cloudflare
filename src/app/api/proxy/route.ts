// app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    
    // Handle m3u8 files
    if (contentType?.includes('application/vnd.apple.mpegurl') || 
        contentType?.includes('application/x-mpegURL') ||
        url.endsWith('.m3u8')) {
      let content = await response.text();
      
      // Get the base URL for relative paths
      const baseUrl = new URL(url);
      baseUrl.pathname = baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf('/') + 1);

      // Replace URIs in EXT-X-MEDIA tags
      content = content.replace(/URI="([^"]+)"/g, (match, uri) => {
        // Check if the URI is already a proxy URL
        if (uri.startsWith('/api/proxy')) {
          return `URI="${uri}"`;
        }
        const absoluteUrl = new URL(uri, baseUrl.toString()).toString();
        return `URI="/api/proxy?url=${encodeURIComponent(absoluteUrl)}"`;
      });

      // Handle non-commented lines (segments and alternative streams)
      content = content.split('\n').map(line => {
        // Skip commented lines and empty lines
        if (line.startsWith('#') || !line.trim()) {
          return line;
        }
        
        // Check if the line is already a proxy URL
        if (line.startsWith('/api/proxy')) {
          return line;
        }

        // Handle relative URLs
        const absoluteUrl = new URL(line, baseUrl.toString()).toString();
        return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
      }).join('\n');
      
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
    
    // Handle other files (ts segments, etc.)
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}