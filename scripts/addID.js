import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "courts.json");
const outputFile = 'output.json';

fs.readFile(DATA_DIR, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    
    if (!Array.isArray(jsonData)) {
      console.error('JSON data is not an array');
      return;
    }

    const processedData = jsonData.map(item => {
      // Initialize city as empty string
      let type = "";
      
      // Check if Court Name contains "District & Sessions Court"
      if (item["Court Name"] && item["Court Name"].includes("High Court")) {
        type = "High Court";
      }
      else {
        type = "Lower Court";
      }

      // Return the object with added type field
      return {
        ...item,
        Type: type
      };
    });

    fs.writeFile(outputFile, JSON.stringify(processedData, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log(`Successfully processed ${processedData.length} items. Output saved to ${outputFile}`);
    });

  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});