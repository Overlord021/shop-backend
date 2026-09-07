# ⚙️ Backend Technology Stack & API Architecture

This repository contains the robust, secure, and production-ready REST API backend service powering the e-commerce application. It is engineered with a modular, scalable architecture, secure cookie-based authentication, strict input validation, comprehensive database modeling, and automated OpenAPI documentation.

---

## 🚀 Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Runtime & Core** | **Node.js** & **JavaScript (ES Modules)** | Modern asynchronous server-side runtime utilizing ECMAScript modules (`import`/`export`). |
| **Framework** | **Express.js (v5)** | Fast, unopinionated, minimalist web framework for building robust REST APIs. |
| **Database** | **MongoDB** & **Mongoose ODM** | NoSQL database with elegant schema-based modeling, validation, and middleware hooks. |
| **Security & Auth** | **JOSE** & **bcrypt** | Cryptographic JWT signing/verification via HTTP-only cookies and secure password hashing. |
| **Validation** | **Zod** | TypeScript-first schema validation with static type inference and robust error flattening. |
| **Middleware & Security**| **Helmet**, **CORS**, **Compression**, **Cookie-Parser** | Production middleware for HTTP header hardening, cross-origin resource sharing, payload compression, and cookie parsing. |
| **API Documentation** | **Swagger / OpenAPI** (`swagger-autogen`, `swagger-ui-express`) | Automated OpenAPI spec generation and interactive Swagger UI explorer. |
| **Development** | **Nodemon** | Development utility for auto-restarting the server on file changes. |

---

## 🏛️ Architecture & Request Flow

The backend follows a clean, layered MVC-inspired architecture ensuring separation of concerns, strict validation boundaries, and secure database interactions.

```text
[ Client (Frontend) ]
       ↓ HTTP Request (with HttpOnly Cookies)
[ Express.js Server ]
       ↓ Security & Rate Limiting Middleware
[ Routes ] ──► [ Validation (Zod) ]
       ↓
[ Controllers ] ──► [ Business Logic & Mongoose Models ]
       ↓
[ MongoDB Atlas / Local Database ]
```

### Core Architecture Layers:
- **Routes (`/routes`):** Define API endpoints and map HTTP methods to controllers with auth/rate-limiting middleware.
- **Controllers (`/controllers`):** Implement business logic, handle request payloads, execute database queries, and return standardized JSON responses.
- **Models (`/models`):** Mongoose schemas defining database structure, data types, indexes, and constraints.
- **Validation (`/validation`):** Zod schemas ensuring incoming request body, query parameters, and identifiers conform strictly to expected types.
- **Middleware (`/middlewares`):** Authentication verification (`auth.js`), rate limiting (`rateLimit.js`), and HTTP security headers.
- **Library (`/lib`):** Utility modules including database initialization (`db.js`), JWT session management (`session.js`), Zod error formatter (`flatten-error.js`), and Swagger configuration.

---

## 📂 Project Structure

```text
shop-api-mongo/
├── controllers/          # Business logic handlers for Auth, Brands, Categories, Media, Products
├── lib/                  # Core utilities (database connection, JWT session, error flattening, Swagger setup)
├── middlewares/          # Security, authentication, and rate limiting middleware
├── models/               # Mongoose database schemas & models (User, Brand, Category, Media, Product)
├── routes/               # API endpoint route definitions
├── validation/           # Zod validation schemas for request inputs
├── .env                  # Environment configuration (ignored in production)
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies, scripts, and metadata
├── package-lock.json     # Locked dependency tree
└── server.js             # Application entry point & Express server configuration
```

---

## 🗄️ Database

- **Database Engine:** MongoDB (Local development) / MongoDB Atlas (Production).
- **ODM:** Mongoose for schema modeling, validation, and database connection lifecycle management.
- **Connection & Initialization (`lib/db.js`):** Establishes resilient connections, ensures single-user administrative registration safety checks, and manages initialization states.
- **Indexing:** Implemented at schema level for performance optimization and unique constraint enforcement (e.g., product filters, unique user indexes).

---

## 🔒 Authentication & Security

- **JWT & Cookie-Based Sessions:** Stateless authentication using cryptographically signed JSON Web Tokens managed via secure `HttpOnly` cookies using the `jose` library.
- **Password Security:** One-way password hashing using `bcrypt` with configurable salt rounds.
- **Security Headers:** Hardened HTTP response headers via `helmet`.
- **CORS Configuration:** Restricted cross-origin resource sharing configured via `cors` targeting authorized client origins.
- **Rate Limiting:** In-memory sliding window rate limiter middleware protecting endpoints against brute-force and DDoS attempts.
- **Input & ID Validation:** Strict schema validation via `Zod` and MongoDB `isValidObjectId` checks preventing malformed queries and injection vulnerabilities.
- **Mass-Assignment Protection:** Controlled controller projections and explicit payload destructuring.

---

## 📚 API Documentation

Interactive API documentation is automatically generated using `swagger-autogen` and served via `swagger-ui-express`:
- **Endpoint:** `/docs`
- **Specification Generation:** Automated build script (`npm run build`) inspects Express routes and produces `lib/swagger/swagger-output.json`.

---

## 🔀 API Route Groups

- **Authentication (`/api/auth`):** Sign up, sign in, session verification, sign out, and registration status checks.
- **Products (`/api/product`):** CRUD operations, advanced search, filtering, pagination, and sorting.
- **Categories (`/api/category`):** Category hierarchy and management.
- **Brands (`/api/brand`):** Brand management and metadata.
- **Media (`/api/media`):** File upload handling and media storage management.

---

## ⚡ Performance Optimization

- **Pagination & Limiting:** Database-level `skip()` and `limit()` paging on list endpoints.
- **Query Optimization:** Targeted field projections and `.lean()` execution where appropriate to reduce memory overhead.
- **Compression:** Gzip/deflate response compression via `compression` middleware.
- **Count Efficiency:** Optimized MongoDB `countDocuments()` queries.
- **Input Length Caps:** Strict Zod string length limits and size constraints on incoming payloads.

---

## 🛠️ Environment Variables

The backend relies on the following environment variables (defined in `.env` locally and hosted environment secrets in production):

```env
MONGO_URI_STRING="mongodb://localhost:27017/shop"
SESSION_SECRET="your_secure_jwt_secret_key"
FRONTEND_URL="http://localhost:3000"
```

---

## 🚀 Local Development

Follow these steps to set up and run the backend service locally:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd shop-api-mongo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory based on the environment variables section above.

4. **Generate Swagger documentation:**
   ```bash
   npm run build
   ```

5. **Start the development server (with Nodemon):**
   ```bash
   npm run dev
   ```
   *The server will start on port `4000`.*

---

## 📦 Production Deployment Architecture

```text
[ GitHub Repository ]
         ↓ Push / CI
[ Cloud Hosting Platform (e.g., Render) ]
         ↓ Secure TLS Connection
[ MongoDB Atlas (Cloud Database) ]
```

- **Runtime:** Node.js production process (`npm start`).
- **Hosting:** Cloud application platforms (e.g., Render / Railway / DigitalOcean).
- **Database:** Fully managed MongoDB Atlas cloud cluster.
- **Security:** HTTPS enforced, environment secrets securely injected via hosting provider dashboard, restricted CORS policy pointing to production client domain.

---

<br>
<hr>
<br>

# 🇮🇷 مستندات فارسی (Persian Documentation)

# ⚙️ پشته فناوری بک‌اند و معماری API

این مخزن شامل سرویس بک‌اند REST API امن، مقیاس‌پذیر و آماده برای تولید است که اپلیکیشن فروشگاهی را پشتیبانی می‌کند. این سیستم با معماری ماژولار، احراز هویت مبتنی بر کوکی امن، اعتبارسنجی دقیق داده‌ها، مدل‌سازی کامل پایگاه داده و مستندسازی خودکار OpenAPI طراحی شده است.

---

## 🚀 پشته فناوری (Technology Stack)

| دسته‌بندی | فناوری | توضیحات |
| :--- | :--- | :--- |
| **محیط اجرا و هسته** | **Node.js** و **JavaScript (ES Modules)** | محیط اجرای سمت سرور مدرن با پشتیبانی از ماژول‌های استاندارد اکمااسکریپت (`import`/`export`). |
| **فریم‌ورک** | **Express.js (v5)** | فریم‌ورک سریع، سبک و منعطف وب برای ساخت APIهای قدرتمند. |
| **پایگاه داده** | **MongoDB** و **Mongoose ODM** | پایگاه داده NoSQL همراه با مدل‌سازی ساختاریافته، اعتبارسنجی و هوک‌های اسکیما. |
| **امنیت و احراز هویت**| **JOSE** و **bcrypt** | امضا و اعتبارسنجی رمزنگاری‌شده JWT از طریق کوکی‌های HttpOnly و هش امن رمز عبور. |
| **اعتبارسنجی** | **Zod** | اعتبارسنجی اسکیما مبتنی بر تایپ‌اسکریپت با قابلیت استنتاج نوع و مدیریت خطاهای ساختاریافته. |
| **میدل‌ورها و امنیت** | **Helmet**, **CORS**, **Compression**, **Cookie-Parser** | میدل‌ورهای تولید برای ایمن‌سازی هدرهای HTTP، اشتراک‌گذاری منابع متقابل، فشرده‌سازی پاسخ‌ها و تجزیه کوکی. |
| **مستند‌سازی API** | **Swagger / OpenAPI** (`swagger-autogen`, `swagger-ui-express`) | تولید خودکار مشخصات OpenAPI و محیط تعاملی Swagger UI. |
| **توسعه** | **Nodemon** | ابزار توسعه برای راه‌اندازی مجدد خودکار سرور هنگام تغییر فایل‌ها. |

---

## 🏛️ معماری و جریان درخواست‌ها

بک‌اند از یک معماری تمیز و لایه‌بندی‌شده الهام‌گرفته از MVC پیروی می‌کند که جداسازی وظایف، مرزهای اعتبارسنجی دقیق و تعاملات امن با پایگاه داده را تضمین می‌کند.

```text
[ کلاینت (فرانت‌اند) ]
       ↓ درخواست HTTP (همراه با کوکی‌های HttpOnly)
[ سرور Express.js ]
       ↓ میدل‌ورهای امنیتی و محدودکننده نرخ درخواست
[ مسیرها (Routes) ] ──► [ اعتبارسنجی (Zod) ]
       ↓
[ کنترلرها (Controllers) ] ──► [ منطق کسب‌وکار و مدل‌های Mongoose ]
       ↓
[ پایگاه داده MongoDB Atlas / محلی ]
```

### لایه‌های اصلی معماری:
- **مسیرها (`/routes`):** تعریف نقاط پایانی API و اتصال متدهای HTTP به کنترلرها همراه با میدل‌ورهای احراز هویت و محدودسازی نرخ.
- **کنترلرها (`/controllers`):** پیاده‌سازی منطق کسب‌وکار، مدیریت داده‌های ورودی، اجرای کوئری‌های پایگاه داده و بازگرداندن پاسخ‌های استاندارد JSON.
- **مدل‌ها (`/models`):** اسکیمای Mongoose برای تعریف ساختار پایگاه داده، انواع داده، ایندکس‌ها و محدودیت‌ها.
- **اعتبارسنجی (`/validation`):** اسکیماهای Zod برای اطمینان از تطابق بدنه درخواست، پارامترها و شناسه‌ها با انواع مورد انتظار.
- **میدل‌ورها (`/middlewares`):** اعتبارسنجی احراز هویت (`auth.js`)، محدودسازی نرخ درخواست (`rateLimit.js`) و هدرهای امنیتی HTTP.
- **کتابخانه (`/lib`):** ماژول‌های کمکی شامل اتصال پایگاه داده (`db.js`)، مدیریت نشست JWT (`session.js`)، فرمت‌کننده خطای Zod (`flatten-error.js`) و تنظیمات Swagger.

---

## 📂 ساختار پروژه

```text
shop-api-mongo/
├── controllers/          # کنترلرهای منطق کسب‌وکار برای احراز هویت، برندها، دسته‌بندی‌ها، رسانه و محصولات
├── lib/                  # ابزارهای هسته (اتصال پایگاه داده، نشست JWT، پردازش خطا، راه‌اندازی Swagger)
├── middlewares/          # میدل‌ورهای امنیتی، احراز هویت و محدودسازی نرخ درخواست
├── models/               # مدل‌ها و اسکیماهای پایگاه داده Mongoose
├── routes/               # تعریف مسیرهای نقاط پایانی API
├── validation/           # اسکیماهای اعتبارسنجی Zod برای ورودی‌های درخواست
├── .env                  # تنظیمات محیطی (در محیط تولید نادیده گرفته می‌شود)
├── .gitignore            # قوانین نادیده‌گیری گیت
├── package.json          # وابستگی‌ها، اسکریپت‌ها و اطلاعات پروژه
├── package-lock.json     # درخت دقیق وابستگی‌های قفل‌شده
└── server.js             # نقطه ورود برنامه و تنظیمات سرور Express
```

---

## 🗄️ پایگاه داده

- **موتور پایگاه داده:** MongoDB (توسعه محلی) / MongoDB Atlas (محیط تولید).
- **ODM:** پکیج Mongoose برای مدل‌سازی اسکیما، اعتبارسنجی و مدیریت چرخه عمر اتصال به پایگاه داده.
- **اتصال و راه‌اندازی (`lib/db.js`):** برقراری اتصال پایدار، بررسی‌های امنیتی ثبت‌نام اولیه تک‌کاربره و مدیریت وضعیت‌های راه‌اندازی.
- **اینداکس‌گذاری:** پیاده‌سازی در سطح اسکیما برای بهینه‌سازی عملکرد و اعمال محدودیت‌های یکتا (مانند فیلتر محصولات و ایندکس یکتای کاربر).

---

## 🔒 احراز هویت و امنیت

- **نشست‌های مبتنی بر JWT و کوکی:** احراز هویت بدون حالت با استفاده از توکن‌های امضاشده JWT که از طریق کوکی‌های امن `HttpOnly` و کتابخانه `jose` مدیریت می‌شوند.
- **امنیت رمز عبور:** هش کردن یک‌طرفه رمز عبور با استفاده از `bcrypt` و تعداد دور نمک‌گذاری قابل‌تنظیم.
- **هدرهای امنیتی:** مقاوم‌سازی هدرهای پاسخ HTTP با استفاده از `helmet`.
- **تنظیمات CORS:** محدودسازی اشتراک‌گذاری منابع متقابل با استفاده از `cors` برای دامنه‌های مجاز کلاینت.
- **محدودسازی نرخ درخواست (Rate Limiting):** میدل‌ور محافظت از نقاط پایانی در برابر حملات بروت‌فورس و DDoS.
- **اعتبارسنجی ورودی‌ها و شناسه‌ها:** اعتبارسنجی دقیق اسکیماها توسط `Zod` و بررسی `isValidObjectId` در مونگو دی‌بی برای جلوگیری از خطاهای ساختاری و آسیب‌پذیری‌ها.
- **محافظت در برابر Mass-Assignment:** پروژکشن‌های کنترل‌شده در کنترلرها و جداسازی صریح داده‌های دریافتی.

---

## 📚 مستندات API

مستندات تعاملی API به صورت خودکار با استفاده از `swagger-autogen` تولید شده و از طریق `swagger-ui-express` ارائه می‌شود:
- **مسیر مستندات:** `/docs`
- **تولید مشخصات:** اسکریپت بیلد خودکار (`npm run build`) مسیرهای Express را اسکن کرده و فایل `lib/swagger/swagger-output.json` را تولید می‌کند.

---

## 🔀 گروه‌های مسیرهای API

- **احراز هویت (`/api/auth`):** ثبت‌نام، ورود، بررسی نشست، خروج و بررسی وضعیت ثبت‌نام.
- **محصولات (`/api/product`):** عملیات CRUD، جستجوی پیشرفته، فیلترینگ، صفحه‌بندی و مرتب‌سازی.
- **دسته‌بندی‌ها (`/api/category`):** مدیریت ساختار و درخت دسته‌بندی‌ها.
- **برندها (`/api/brand`):** مدیریت برندها و متادیتا.
- **رسانه (`/api/media`):** مدیریت آپلود فایل و ذخیره‌سازی رسانه.

---

## ⚡ بهینه‌سازی عملکرد

- **صفحه‌بندی و محدودسازی:** استفاده از `skip()` و `limit()` در سطح پایگاه داده برای لیست‌ها.
- **بهینه‌سازی کوئری:** پروژکشن فیلدهای هدفمند و استفاده از `.lean()` در صورت نیاز برای کاهش سربار حافظه.
- **فشرده‌سازی:** فشرده‌سازی پاسخ‌های Gzip/deflate با استفاده از میدل‌ور `compression`.
- **شمارش بهینه:** کوئری‌های بهینه‌شده `countDocuments()` در مونگو دی‌بی.
- **محدودیت طول ورودی:** اعمال محدودیت‌های سخت‌گیرانه طول رشته توسط Zod روی بارهای دریافتی.

---

## 🛠️ متغیرهای محیطی

بک‌اند به متغیرهای محیطی زیر وابسته است (در فایل محلی `.env` و متغیرهای امنیتی پنل میزبانی در تولید):

```env
MONGO_URI_STRING="mongodb://localhost:27017/shop"
SESSION_SECRET="your_secure_jwt_secret_key"
FRONTEND_URL="http://localhost:3000"
```

---

## 🚀 راه‌اندازی برای توسعه محلی

برای راه‌اندازی و اجرای سرویس بک‌اند به صورت محلی مراحل زیر را دنبال کنید:

1. **کلون کردن مخزن:**
   ```bash
   git clone <repository-url>
   cd shop-api-mongo
   ```

2. **نصب وابستگی‌ها:**
   ```bash
   npm install
   ```

3. **تنظیم متغیرهای محیطی:**
   یک فایل `.env` در پوشه ریشه بر اساس بخش متغیرهای محیطی بالا ایجاد کنید.

4. **تولید مستندات Swagger:**
   ```bash
   npm run build
   ```

5. **اجرای سرور توسعه (با Nodemon):**
   ```bash
   npm run dev
   ```
   *سرور روی پورت `4000` اجرا خواهد شد.*

---

## 📦 معماری استقرار در محیط تولید

```text
[ مخزن گیت‌هاب (GitHub) ]
         ↓ Push / CI
[ پلتفرم ابری میزبانی (مثل Render) ]
         ↓ اتصال امن TLS
[ پایگاه داده ابری MongoDB Atlas ]
```

- **محیط اجرا:** پروسه تولید Node.js (`npm start`).
- **میزبانی:** پلتفرم‌های ابری اپلیکیشن (مانند Render / Railway / DigitalOcean).
- **پایگاه داده:** کلاستر ابری کاملاً مدیریت‌شده MongoDB Atlas.
- **امنیت:** اجبار به استفاده از HTTPS، تزریق امن متغیرهای محیطی از طریق داشبورد پلتفرم میزبانی و سیاست CORS محدود به دامنه کلاینت در تولید.
