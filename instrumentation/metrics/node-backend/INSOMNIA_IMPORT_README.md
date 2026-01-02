# Insomnia Collection for Product Service API

This file contains an Insomnia collection for testing the NestJS Product Service API.

## 📥 How to Import

### Method 1: Import from File
1. Open Insomnia
2. Click **Create** → **Import from File**
3. Select the `insomnia-collection.json` file
4. The collection will be imported with all requests and environments

### Method 2: Import from URL
1. Open Insomnia
2. Click **Create** → **Import from URL**
3. Paste the raw content of the JSON file
4. Click **Import**

## 🏗️ Collection Structure

The collection includes:

### **Workspace: Product Service API**
- **Description**: NestJS Product Service API with OpenTelemetry and structured logging

### **API Endpoints**

#### **Health & Status**
- `GET /` - Root endpoint
- `GET /health` - Health check (application + database)

#### **Products CRUD**
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### **Environments**

#### **Development**
- **Base URL**: `http://localhost:3000`
- **Product ID**: `1`
- **Color**: Purple

#### **Production**
- **Base URL**: `https://your-production-domain.com`
- **Product ID**: `1`
- **Color**: Red

## 🚀 Getting Started

### 1. Start Your Application
```bash
# Development
npm run start:dev

# Production
npm run start:prod

# Docker
docker-compose up app-dev
```

### 2. Select Environment
- Choose **Development** for local testing
- Choose **Production** for production testing

### 3. Test Endpoints
- Start with **Health Check** to verify the service is running
- Use **Create Product** to add test data
- Test **Get All Products** to see the data
- Use **Update Product** and **Delete Product** for full CRUD testing

## 📝 Request Examples

### Create Product
```json
{
  "name": "Sample Product",
  "price": 29.99,
  "stock": 100
}
```

### Update Product
```json
{
  "name": "Updated Product Name",
  "price": 39.99,
  "stock": 150
}
```

## 🔧 Environment Variables

The collection uses these environment variables:
- `{{ _.base_url }}` - Base URL for the API
- `{{ _.product_id }}` - Default product ID for testing

## 📊 Expected Responses

### Health Check Response
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

### Product Response
```json
{
  "id": 1,
  "name": "Sample Product",
  "price": 29.99,
  "stock": 100,
  "createdAt": "2025-09-01T19:45:00.000Z",
  "updatedAt": "2025-09-01T19:45:00.000Z"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure your application is running
   - Check the port (default: 3000)
   - Verify firewall settings

2. **404 Not Found**
   - Check the base URL in your environment
   - Ensure the endpoint path is correct

3. **Validation Errors**
   - Check the request body format
   - Verify required fields are present
   - Ensure data types are correct

### Debug Mode
- Check the application logs for detailed error information
- Use the **Health Check** endpoint to verify service status
- Verify database connectivity

## 🔄 Updating the Collection

To add new endpoints or modify existing ones:

1. Make changes in Insomnia
2. Export the collection: **Project** → **Export Data** → **Insomnia Collection v4**
3. Replace the `insomnia-collection.json` file
4. Commit the changes to version control

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Insomnia Documentation](https://docs.insomnia.rest/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
