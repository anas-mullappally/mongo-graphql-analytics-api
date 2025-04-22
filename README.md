# Sales & Revenue Analytics API (GraphQL + MongoDB)

A high-performance analytics API built with **Node.js, Express, GraphQL, and MongoDB** featuring UUID-based identifiers and comprehensive sales insights.

---

## Key Features

### Customer Insights
- Total lifetime spending per customer
- Last purchase date tracking
- Average order value calculation

### Product Analytics
- Top-selling products by quantity sold
- Product performance metrics

### Revenue Reporting
- Time-based revenue analytics
- Category-wise revenue breakdown
- Completed order statistics

---

## Tech Stack

| Component          | Technology               |
|--------------------|--------------------------|
| API Server         | Node.js + Express        |
| Query Language     | GraphQL (`graphql-http`) |
| Database           | MongoDB (Mongoose ODM)   |
| ID System          | UUID v4                  |
| Data Import        | CSV seed scripts         |
| Testing            | Postman Collection       |

---

## Quick Start

### 1. Environment Setup

```bash
# Clone repository
git clone https://github.com/your-username/sales-analytics-api.git
cd sales-analytics-api

# Install dependencies
npm install

# Set up environment
cp .env.example .env
```

### 2. Database Configuration

Update `.env` with your MongoDB URI:
```env
MONGO_URI=mongodb://localhost:27017/salesAnalytics
PORT=4000
```

### 3. Data Seeding

Place your CSV files in `/seed/data`:
- `customers.csv`
- `products.csv` 
- `orders.csv`

Run the importer:
```bash
node seed/import.js
```
> ⚠️ This will reset your database with fresh UUID-based records

### 4. Start the Server
```bash
node src/index.js
```
API will be available at: `http://localhost:4000/graphql`

---

## 📚 API Documentation

### Core Queries

#### Customer Spending Analysis
```graphql
query CustomerSpending($customerId: ID!) {
  getCustomerSpending(customerId: $customerId) {
    customerId
    totalSpent
    averageOrderValue
    lastOrderDate
  }
}
```

#### Product Performance
```graphql
query TopProducts($limit: Int = 5) {
  getTopSellingProducts(limit: $limit) {
    productId
    name
    totalSold
    category
  }
}
```

#### Revenue Analytics
```graphql
query SalesReport(
  $startDate: String!
  $endDate: String!
) {
  getSalesAnalytics(
    startDate: $startDate
    endDate: $endDate
  ) {
    totalRevenue
    completedOrders
    categoryBreakdown {
      category
      revenue
      percentage
    }
  }
}
```

---

## 🏗 Project Architecture

```
.
├── src/
│   ├── config/         # Database configuration
│   ├── graphql/        # GraphQL implementation
│   │   ├── resolvers/  # Query resolvers
│   │   ├── schemas/    # Type definitions
│   │   └── utils/      # Helper functions
│   ├── models/         # Mongoose schemas
│   └── index.js       # Server entry point
├── seed/               # Data seeding scripts
├── postman/            # API test collection
└── docs/               # Additional documentation
```

---

## 🧪 Testing

1. Import the provided Postman collection
2. Environment variables:
   - `base_url`: `http://localhost:4000`
3. Sample test cases included for all major queries

---

## 📈 Performance Considerations

- Indexes automatically created for:
  - Customer IDs
  - Product IDs
  - Order timestamps
- Aggregation pipelines optimized for large datasets
- Configurable query depth limits

---

## 📄 License

MIT License - Free for commercial and personal use.

---

**Developed by Anas**  
[GitHub Profile] | [LinkedIn] | [Portfolio]
```