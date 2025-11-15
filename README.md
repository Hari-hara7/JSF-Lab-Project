<div align="center">

# 🚀 QUERIFY.AI

### Transform Natural Language into Powerful SQL Queries

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue.svg)](https://neon.tech/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0%20Flash-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Querify.AI** is an intelligent natural language to SQL converter powered by Google's Gemini 2.0 Flash, designed to make database queries accessible to everyone—no SQL knowledge required.

[Features](#-features) • [Architecture](#-architecture) • [Screenshots](#-screenshots) • [Setup](#-quick-setup) • [API](#-api-reference) • [Contributing](#-contributing)

</div>

---

## ✨ Features

🔹 **Natural Language Processing** - Ask questions in plain English  
🔹 **AI-Powered SQL Generation** - Gemini 2.0 Flash generates optimized queries  
🔹 **Real-time Validation** - Smart SQL validation with security checks  
🔹 **Interactive Results** - Visualize data with tables and charts  
🔹 **Query History** - Track and revisit past queries  
🔹 **PostgreSQL Integration** - Powered by Neon serverless Postgres  
🔹 **Modern UI** - Beautiful Next.js frontend with Tailwind CSS  
🔹 **RESTful API** - Clean Spring Boot backend architecture  

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js UI    │  ← User asks: "Show top 10 customers by sales"
│  (Frontend)     │
└────────┬────────┘
         │ HTTP POST /api/query
         ↓
┌─────────────────┐
│  Spring Boot    │  ← Receives prompt + chartType + limit
│   (Backend)     │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌─────────┐ ┌──────────────┐
│ Gemini  │ │  PostgreSQL  │
│   AI    │ │  (Neon DB)   │
│ (SQL    │ │              │
│  Gen)   │ │ • Validates  │
└─────────┘ │ • Executes   │
            │ • Returns    │
            └──────────────┘
```

**Flow:**
1. User enters natural language query
2. Frontend sends request to Spring Boot backend
3. Backend builds schema context from PostgreSQL
4. Gemini AI generates SQL from prompt + schema
5. SQL Validator ensures SELECT-only & safety
6. Query executed on Neon PostgreSQL
7. Results returned with metadata + visualization options
8. Query history persisted for future reference

---

## 📸 Screenshots

### Query Interface
![Query Interface](./querify-frontend/app/public/WhatsApp%20Image%202025-11-10%20at%2015.20.31_99c9487b.jpg)

### Results Visualization
![Results Table](./querify-frontend/app/public/WhatsApp%20Image%202025-11-10%20at%2015.20.50_57e607c9.jpg)

### Chart Rendering
![Chart View](./querify-frontend/app/public/WhatsApp%20Image%202025-11-10%20at%2015.21.17_3624f484.jpg)

### Query History
![History Dashboard](./querify-frontend/app/public/WhatsApp%20Image%202025-11-10%20at%2015.21.37_d12f664f.jpg)

### Data Export Options
![Export Features](./querify-frontend/app/public/WhatsApp%20Image%202025-11-10%20at%2015.22.31_139f820c.jpg)

### Mobile Responsive
![Mobile View](./querify-frontend/app/public/WhatsApp%20Image%202025-11-10%20at%2015.23.22_a26a1aaa.jpg)

### Advanced Queries
![Complex Query](./querify-frontend/app/public/WhatsApp%20Image%202025-11-10%20at%2015.23.44_12a8d272.jpg)

---

## 🚀 Quick Setup

### Prerequisites

- **Java 17+** (for Spring Boot backend)
- **Node.js 18+** (for Next.js frontend)
- **PostgreSQL** (Neon DB account recommended)
- **Gemini API Key** ([Get one here](https://ai.google.dev/))

### Backend Setup

```bash
# Navigate to backend directory
cd querify-backend

# Configure your credentials in application.properties
# Edit: src/main/resources/application.properties
# Set:
#   - spring.datasource.url (your Neon DB connection string)
#   - spring.datasource.username
#   - spring.datasource.password
#   - gemini.api.key (your Gemini API key)

# Run the Spring Boot application
./mvnw spring-boot:run

# Backend will start on http://localhost:8080
```

**⚠️ Important:** Never commit your `application.properties` with real credentials. Use environment variables in production.

### Frontend Setup

```bash
# Navigate to frontend directory
cd querify-frontend/app

# Install dependencies
npm install

# Start the development server
npm run dev

# Frontend will start on http://localhost:3000
```

---

## 🔧 Configuration

### Environment Variables (Recommended for Production)

Create a `.env` file in `querify-backend/`:

```properties
# Database
DB_URL=jdbc:postgresql://your-neon-instance.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent

# Application
SERVER_PORT=8080
QUERIFY_QUERY_DEFAULT_LIMIT=500
```

Update `application.properties` to use environment variables:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
gemini.api.key=${GEMINI_API_KEY}
```

---

## 📡 API Reference

### POST `/api/query`

Execute a natural language query.

**Request Body:**
```json
{
  "prompt": "Show top 5 customers by total purchases in 2024",
  "chartType": "bar",
  "limit": 5
}
```

**Response (Success):**
```json
{
  "sql": "SELECT customer_id, SUM(amount) FROM orders WHERE year = 2024 GROUP BY customer_id ORDER BY SUM(amount) DESC LIMIT 5",
  "validated": true,
  "rows": [
    {"customer_id": 101, "sum": 15000},
    {"customer_id": 203, "sum": 12500}
  ],
  "columns": ["customer_id", "sum"],
  "rowCount": 5,
  "queryId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (Error):**
```json
{
  "validated": false,
  "error": "Generated SQL is not valid or not allowed (only SELECT allowed).",
  "rows": [],
  "columns": [],
  "rowCount": 0
}
```

### GET `/api/history`

Retrieve recent query history (last 200 queries).

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "prompt": "Show top 5 customers by sales",
    "generatedSql": "SELECT ...",
    "validated": true,
    "resultRowCount": 5,
    "chartType": "bar",
    "createdAt": "2025-11-15T10:30:00Z"
  }
]
```

---

## 💡 Example Queries

### User/Order Queries
- "Show all orders placed by Alice"
- "List the top 3 users with the highest total order value"
- "Find all products ordered more than twice"
- "List orders with total greater than 1000"

### Product Queries
- "Show all products priced above 500"
- "List the most popular product based on quantity sold"
- "Find total sales for each product"

### Aggregation / Analytics
- "Number of orders per user"
- "Total revenue per month"
- "Average order total for each user"
- "Top 5 products by revenue"

### Complex Queries
- "Show all orders with user name and product names included"
- "Find users who bought both Laptop and Phone"
- "List orders where total is greater than average order total"

---

## 🔒 Security Features

✅ **SQL Injection Protection** - Only SELECT queries allowed  
✅ **Keyword Blacklist** - Blocks INSERT, UPDATE, DELETE, DROP, ALTER  
✅ **Query Limits** - Enforces row limits (default: 500)  
✅ **CORS Configuration** - Controlled origin access  
✅ **Input Validation** - Prompt and parameter validation  
✅ **Error Handling** - Global exception handler with safe error messages  

**Security Best Practices:**
- Move API keys to environment variables
- Use read-only database users for query execution
- Implement rate limiting on API endpoints
- Add authentication/authorization for production
- Enable query timeouts to prevent long-running queries
- Audit and log all queries for monitoring

---

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.x** - REST API framework
- **Spring Data JPA** - Database ORM
- **JdbcTemplate** - Direct SQL execution
- **PostgreSQL** - Primary database (Neon serverless)
- **Lombok** - Boilerplate reduction
- **Maven** - Dependency management

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **Recharts** - Data visualization
- **Papa Parse** - CSV export

### AI/External
- **Google Gemini 2.0 Flash** - SQL generation
- **Neon PostgreSQL** - Serverless database

---

## 🐛 Troubleshooting

### Port 8080 Already in Use

```powershell
# Find process using port 8080
netstat -ano | findstr :8080


You’ll get something like:

TCP    0.0.0.0:8080    0.0.0.0:0    LISTENING    12345


Then kill that process:

taskkill /PID 27184 /F
# Kill the process (replace 12345 with actual PID)
taskkill /PID 12345 /F

# Restart backend
./mvnw spring-boot:run
```

### Gemini API Errors

- Verify your API key is correct
- Check API quota/limits at [Google AI Studio](https://ai.google.dev/)
- Ensure network connectivity to Gemini API

### Database Connection Issues

- Verify Neon DB connection string format
- Check username/password credentials
- Ensure SSL mode is set correctly (`sslmode=require`)
- Verify database is not paused (Neon auto-pauses inactive DBs)

---

## 📂 Project Structure

```
JSF-Lab-Project/
├── querify-backend/           # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/querifyai/querify_backend/
│   │   │   │   ├── controller/    # REST Controllers
│   │   │   │   ├── service/       # Business Logic
│   │   │   │   ├── model/         # JPA Entities & DTOs
│   │   │   │   ├── repository/    # Data Access
│   │   │   │   ├── util/          # Validators & Helpers
│   │   │   │   └── config/        # Configuration Classes
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                  # Unit & Integration Tests
│   ├── pom.xml                    # Maven Dependencies
│   └── mvnw                       # Maven Wrapper
│
└── querify-frontend/          # Next.js Frontend
    └── app/
        ├── app/
        │   ├── page.tsx           # Home Page
        │   ├── query/             # Query Interface
        │   └── history/           # History Dashboard
        ├── components/            # React Components
        ├── lib/                   # Utilities & API
        ├── public/                # Static Assets & Screenshots
        └── package.json           # NPM Dependencies
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**Hari-hara7** - [GitHub Profile](https://github.com/Hari-hara7)

---

## 🙏 Acknowledgments

- Google Gemini AI for powerful language models
- Neon for serverless PostgreSQL
- Spring Boot & Next.js communities
- All open-source contributors

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ using Spring Boot & Next.js

</div>
