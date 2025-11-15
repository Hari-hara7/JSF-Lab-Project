# JSF-Lab-Project
QUERIFY.AI

⿡ User/Order Queries
Show all orders placed by Alice.
List the top 3 users with the highest total order value.
Find all products ordered more than twice.
List the orders with total greater than 1000.

⿢ Product Queries
Show all products priced above 500.
List the most popular product based on quantity sold.
Find total sales for each product.

⿣ Aggregation / Analytics
Number of orders per user.
Total revenue per month.
Average order total for each user.
Top 5 products by revenue.

⿤ Join / Complex Queries
Show all orders with user name and product names included.
Find users who bought both Laptop and Phone.
List orders where total is greater than average order total.






SYNAPSEDB

postgresql://neondb_owner:npg_LK1rfvNUXn4c@ep-delicate-firefly-adhjs6m1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require


Count total documents
Show all query logs






🧾 STEP 3: Set the API Request
🔹 Request Type:

Select POST

🔹 URL:
http://localhost:8080/api/query

🧱 STEP 4: Set Headers

Go to the Headers tab and add:

Key	Value
Content-Type	application/json
🧠 STEP 5: Add the Request Body

Click the Body tab → choose raw → select JSON from the dropdown on the right.

Paste this sample:

{
  "prompt": "Show top 5 customers by total purchases in 2024",
  "chartType": "bar",
  "limit": 5
}


This will send your natural language query to Gemini → generate SQL → validate → run it on Neon DB → return result.

./mvnw spring-boot:run



🧹 Fix — Option 1: Kill the existing process (recommended)

Run this in PowerShell (same terminal):

netstat -ano | findstr :8080


You’ll get something like:

TCP    0.0.0.0:8080    0.0.0.0:0    LISTENING    12345


Then kill that process:

taskkill /PID 27184 /F


Now restart your app:

./mvnw spring-boot:run

