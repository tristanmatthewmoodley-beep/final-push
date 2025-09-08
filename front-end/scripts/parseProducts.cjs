const fs = require('fs');
const path = require('path');

function parseProductsFromText() {
  try {
    const textPath = path.join(__dirname, '../extracted-pdf-content.txt');
    const text = fs.readFileSync(textPath, 'utf8');
    
    const products = [];
    let currentId = 1;
    
    // Split text into lines and clean them
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Product patterns to match
    const productCodePattern = /^[A-Z]\d+[A-Z]?$/;
    const pricePattern = /R?\d+[.,]?\d*\s*(each|per kit|per set)/i;
    const brandPattern = /^(AUDI|BMW|CHEVROLET|FORD|HAVAL|HONDA|HYUNDAI|ISUZU|JEEP|KIA|LAND ROVER|MAZDA|MERCEDES|MINI|MITSUBISHI|NISSAN|OPEL|RENAULT|SUZUKI|TOYOTA|VOLKSWAGEN|VOLVO)/i;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if line contains a product code
      if (productCodePattern.test(line)) {
        const productCode = line;
        let brand = '';
        let name = '';
        let description = '';
        let price = '';
        let category = 'Auto Parts';
        
        // Look ahead for brand and product info
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const nextLine = lines[j];
          
          // Check for brand
          if (brandPattern.test(nextLine) && !brand) {
            brand = nextLine.split('/')[0].trim(); // Take first brand if multiple
          }
          
          // Check for price
          if (pricePattern.test(nextLine) && !price) {
            const priceMatch = nextLine.match(/R?(\d+[.,]?\d*)/);
            if (priceMatch) {
              const originalPrice = parseFloat(priceMatch[1].replace(',', ''));
              const markedUpPrice = originalPrice * 1.35; // 35% markup
              price = `R${markedUpPrice.toFixed(2)}`;
            }
            break; // Stop looking after finding price
          }
          
          // Build product name and description
          if (!brandPattern.test(nextLine) && !pricePattern.test(nextLine) && !productCodePattern.test(nextLine)) {
            if (!name && nextLine.length > 5) {
              name = nextLine;
            } else if (name && nextLine.length > 5 && nextLine.startsWith('*')) {
              description += (description ? ' ' : '') + nextLine;
            }
          }
        }
        
        // Determine category based on product name/description
        const fullText = (name + ' ' + description).toLowerCase();
        if (fullText.includes('brake')) category = 'Brakes';
        else if (fullText.includes('engine') || fullText.includes('oil')) category = 'Engine';
        else if (fullText.includes('filter')) category = 'Filters';
        else if (fullText.includes('suspension') || fullText.includes('shock')) category = 'Suspension';
        else if (fullText.includes('light') || fullText.includes('lamp') || fullText.includes('globe')) category = 'Lighting';
        else if (fullText.includes('electrical') || fullText.includes('switch') || fullText.includes('sensor')) category = 'Electrical';
        else if (fullText.includes('body') || fullText.includes('bumper') || fullText.includes('door')) category = 'Body Parts';
        else if (fullText.includes('interior') || fullText.includes('seat')) category = 'Interior';
        else if (fullText.includes('exhaust')) category = 'Exhaust';
        else if (fullText.includes('clutch') || fullText.includes('gearbox')) category = 'Transmission';
        else if (fullText.includes('wiper')) category = 'Accessories';

        // Generate product image based on category
        const getProductImage = (category, productCode) => {
          const imageMap = {
            'Brakes': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
            'Engine': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop',
            'Filters': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop',
            'Suspension': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&fit=crop',
            'Lighting': 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=300&h=200&fit=crop',
            'Electrical': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
            'Body Parts': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop',
            'Interior': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop',
            'Exhaust': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
            'Transmission': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop',
            'Accessories': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop'
          };
          return imageMap[category] || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop';
        };

        // Generate additional product details
        const generateProductDetails = (category, name, brand) => {
          const details = {
            warranty: '12 months',
            origin: 'OEM Quality',
            weight: `${(Math.random() * 5 + 0.5).toFixed(1)}kg`,
            dimensions: `${Math.floor(Math.random() * 30 + 10)}cm x ${Math.floor(Math.random() * 20 + 5)}cm x ${Math.floor(Math.random() * 15 + 3)}cm`,
            material: category === 'Brakes' ? 'Ceramic/Steel' :
                     category === 'Engine' ? 'High-grade Steel' :
                     category === 'Filters' ? 'Premium Filter Media' :
                     category === 'Lighting' ? 'LED/Halogen' : 'Steel/Aluminum',
            compatibility: `Compatible with ${brand} vehicles`,
            features: []
          };

          // Add category-specific features
          if (category === 'Brakes') {
            details.features = ['Superior stopping power', 'Low dust formula', 'Noise-free operation', 'Extended lifespan'];
          } else if (category === 'Engine') {
            details.features = ['High performance', 'Fuel efficient', 'Durable construction', 'Easy installation'];
          } else if (category === 'Filters') {
            details.features = ['High filtration efficiency', 'Long service life', 'Easy replacement', 'OEM specifications'];
          } else if (category === 'Lighting') {
            details.features = ['Bright illumination', 'Energy efficient', 'Long lifespan', 'Easy installation'];
          } else {
            details.features = ['Premium quality', 'Reliable performance', 'Easy installation', 'Long lasting'];
          }

          return details;
        };
        
        // Only add if we have essential info
        if (brand && name && price) {
          const productDetails = generateProductDetails(category, name, brand);

          products.push({
            id: currentId++,
            name: name.length > 50 ? name.substring(0, 50) + '...' : name,
            price: price,
            category: category,
            brand: brand,
            productCode: productCode,
            description: description || `${brand} ${name}`,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Random rating between 3.5-5.0
            image: getProductImage(category, productCode),
            inStock: Math.random() > 0.1, // 90% chance of being in stock
            stockQuantity: Math.floor(Math.random() * 50) + 5,
            details: productDetails,
            reviews: Math.floor(Math.random() * 200) + 10, // Random review count
            tags: [category, brand, 'OEM', 'Quality'],
            sku: `MSA-${productCode}`,
            barcode: `${Math.floor(Math.random() * 9000000000000) + 1000000000000}`,
            installationTime: `${Math.floor(Math.random() * 120) + 30} minutes`,
            difficulty: ['Easy', 'Moderate', 'Advanced'][Math.floor(Math.random() * 3)]
          });
        }
      }
    }
    
    console.log(`Parsed ${products.length} products`);
    
    // Save products to JSON file
    const outputPath = path.join(__dirname, '../src/data/products.json');
    
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
    console.log(`Products saved to: ${outputPath}`);
    
    // Show sample products
    console.log('\nSample products:');
    products.slice(0, 5).forEach(product => {
      console.log(`${product.productCode} - ${product.brand} ${product.name} - ${product.price} (${product.category})`);
    });
    
    return products;
    
  } catch (error) {
    console.error('Error parsing products:', error);
  }
}

parseProductsFromText();
