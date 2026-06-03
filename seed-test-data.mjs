import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function seedTestData() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    // Get or create a test user
    const [users] = await connection.query(
      'SELECT id FROM users LIMIT 1'
    );
    
    let userId;
    if (users.length === 0) {
      const [result] = await connection.query(
        'INSERT INTO users (openId, name, email, role) VALUES (?, ?, ?, ?)',
        ['test-user-001', 'مستخدم اختبار', 'test@example.com', 'user']
      );
      userId = result.insertId;
    } else {
      userId = users[0].id;
    }

    console.log(`Using user ID: ${userId}`);

    // Insert test properties
    const testProperties = [
      {
        title: 'فيلا فاخرة بحمام سباحة',
        description: 'فيلا حديثة بمساحة 300 متر مربع مع حمام سباحة وحديقة',
        type: 'villa',
        operationType: 'sale',
        price: '2500000.00',
        area: 300,
        location: 'منطقة الملوك',
        phoneNumber: '+201001234567',
        whatsappNumber: '+201001234567'
      },
      {
        title: 'شقة سكنية حديثة',
        description: 'شقة بمساحة 120 متر مربع في عمارة حديثة',
        type: 'apartment',
        operationType: 'rent',
        price: '3500.00',
        area: 120,
        location: 'من شارع 51 لمسجد الرحمة',
        phoneNumber: '+201002345678',
        whatsappNumber: '+201002345678'
      },
      {
        title: 'أرض سكنية للبيع',
        description: 'أرض بمساحة 500 متر مربع في موقع استراتيجي',
        type: 'land',
        operationType: 'sale',
        price: '1500000.00',
        area: 500,
        location: 'منطقة الإمتداد العمراني',
        phoneNumber: '+201003456789',
        whatsappNumber: '+201003456789'
      },
      {
        title: 'منزل عائلي مميز',
        description: 'منزل بمساحة 250 متر مربع مع حديقة وموقف سيارات',
        type: 'house',
        operationType: 'sale',
        price: '1800000.00',
        area: 250,
        location: 'من شارع 109 لشارع 51',
        phoneNumber: '+201004567890',
        whatsappNumber: '+201004567890'
      }
    ];

    const propertyImages = [
      {
        propertyIndex: 0,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
        order: 0
      },
      {
        propertyIndex: 0,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&q=2',
        order: 1
      },
      {
        propertyIndex: 1,
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        order: 0
      },
      {
        propertyIndex: 2,
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-7049fae79e74?w=800&h=600&fit=crop',
        order: 0
      },
      {
        propertyIndex: 3,
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800&h=600&fit=crop',
        order: 0
      }
    ];

    // Insert properties
    const insertedPropertyIds = [];
    for (const prop of testProperties) {
      const [result] = await connection.query(
        'INSERT INTO properties (userId, title, description, type, operationType, price, area, location, phoneNumber, whatsappNumber, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, prop.title, prop.description, prop.type, prop.operationType, prop.price, prop.area, prop.location, prop.phoneNumber, prop.whatsappNumber, true]
      );
      insertedPropertyIds.push(result.insertId);
      console.log(`✓ Property added: ${prop.title} (ID: ${result.insertId})`);
    }

    // Insert images
    for (const img of propertyImages) {
      const propertyId = insertedPropertyIds[img.propertyIndex];
      const [result] = await connection.query(
        'INSERT INTO propertyImages (propertyId, imageUrl, imageKey, `order`) VALUES (?, ?, ?, ?)',
        [propertyId, img.imageUrl, '', img.order]
      );
      console.log(`✓ Image added to property ${propertyId}`);
    }

    console.log('\n✅ Test data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await connection.end();
  }
}

seedTestData();
