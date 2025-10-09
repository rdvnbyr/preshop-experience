import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'places-app-client',
    version: process.env.npm_package_version || '1.0.0'
  }, { status: 200 });
}