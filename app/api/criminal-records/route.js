import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Directory path - adjust as needed based on your deployment
    const directoryPath = path.join(process.cwd(), 'public', 'Criminal Record', 'Gangs');
    
    // Read directory contents
    const files = await fs.readdir(directoryPath);
    
    // Filter for PDF files and create records
    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
    
    const records = pdfFiles.map(file => {
      // Remove extension and format name
      const name = file.replace('.pdf', '')
                       .replace(/_/g, ' ')
                       .replace(/\b\w/g, l => l.toUpperCase());
      
      return {
        name: name,
        date: "2023-01-01", // Static date for now
        file: `/Criminal Record/Gangs/${file}`
      };
    });

    return new Response(JSON.stringify(records), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error reading directory:', error);
    return new Response(JSON.stringify({ error: 'Failed to load records' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}