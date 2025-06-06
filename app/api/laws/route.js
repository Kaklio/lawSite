import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'JSONS', 'laws_list.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const laws = JSON.parse(fileContents);

    // Extract unique categories
    const categories = [...new Set(laws.map(law => law.category))];
    
    // Extract year from title (takes first 4-digit number found)
    const lawsWithYears = laws.map(law => {
      const yearMatch = law.title.match(/\b(1[0-9]{3}|20[0-9]{2})\b/);
      return {
        ...law,
        year: yearMatch ? parseInt(yearMatch[0]) : null,
        filePath: `/Laws/${law.new}`
      };
    });

    return new Response(JSON.stringify({
      laws: lawsWithYears,
      categories: ['All', ...categories.sort()]
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error reading laws data:', error);
    return new Response(JSON.stringify({ error: 'Failed to load laws data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}