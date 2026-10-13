AGROTRADE BACKEND SETUP
1) XAMPP Control Panel: Start MySQL (Apache is optional for API, but useful for phpMyAdmin).
2) Open http://localhost/phpmyadmin, click SQL, paste all contents of database/schema.sql and click Go.
3) Open this folder in VS Code. Copy .env.example to a new file named .env.
4) If XAMPP root has no password, DB_PASSWORD can stay blank. Otherwise set your MySQL password. Replace JWT_SECRET with a long random secret.
5) VS Code Terminal in this folder:
   npm install
   npm run dev
   (If nodemon fails: npm start)
6) Test http://localhost:5000/api/health. Expected {"status":"ok","database":"connected"}.

API:
POST /api/auth/register  JSON: {"full_name":"Test User","email":"test@example.com","password":"StrongPass123","role":"customer"}
POST /api/auth/login     JSON: {"email":"test@example.com","password":"StrongPass123"}
GET /api/auth/me         Bearer token
GET /api/products
GET /api/products?search=rice
GET /api/products/categories
POST /api/products       Farmer token; JSON: {"name":"Fresh Tomato","price":60,"stock_quantity":20,"category_id":1}
GET /api/products/mine   Farmer token
POST /api/orders         Customer token; JSON: {"items":[{"product_id":1,"quantity":2}],"payment_method":"cod","delivery_name":"Test","delivery_phone":"01XXXXXXXXX","delivery_address":"Dhaka"}
GET /api/orders/mine     Customer token
PATCH /api/orders/:id/cancel
GET /api/payments/order/:id
GET /api/admin/summary   Admin token
GET /api/admin/users
GET /api/admin/orders
PATCH /api/admin/products/:id/status  JSON {"status":"active"}

ADMIN LOCAL SETUP: Public signup deliberately cannot create admins. Register an account, then in phpMyAdmin run:
UPDATE users SET role='admin' WHERE email='your-email@example.com';
Login again to receive admin role in token.

PAYMENT WARNING: bKash/Nagad/Rocket/card entries are only stored as PENDING. No real money is charged. Production payments require official gateway merchant credentials and verified server callbacks. Do not mark payments paid from frontend code.
