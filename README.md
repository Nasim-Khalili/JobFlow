# JobFlow 🚀

A full-stack background job processing platform built with **Django REST Framework, React, Celery, Redis, and PostgreSQL**.

JobFlow allows authenticated users to create background jobs, upload CSV files, monitor processing progress, track job status, and manage asynchronous tasks through a modern web dashboard.

---

## ✨ Features

* 🔐 JWT Authentication
* 👤 User registration and login
* 📊 Modern React dashboard
* ⚙️ Background job processing with Celery
* 🚀 Redis as a message broker
* 🗄️ PostgreSQL database
* 📁 CSV file upload
* 📈 Job progress tracking
* 🔄 Asynchronous task processing
* ❌ Job cancellation
* 🔁 Retry mechanism
* 📝 Job attempt tracking
* 📦 Job result storage
* 🔍 Job details page
* 🔒 Protected frontend routes
* 📱 Responsive SaaS-style UI

---

## 🏗️ Architecture

```text
                ┌───────────────┐
                │     React     │
                │   Frontend    │
                └───────┬───────┘
                        │
                        │ HTTP / REST API
                        ▼
                ┌───────────────┐
                │    Django     │
                │ REST Framework│
                └───────┬───────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
     PostgreSQL      Celery         Redis
       Database      Worker         Broker
                        │
                        ▼
                 CSV Processing
                        │
                        ▼
                  Job Results
```

---

## 🔄 How It Works

The main workflow of JobFlow:

```text
User Login
    ↓
Create Job
    ↓
Upload CSV File
    ↓
Django Creates Job
    ↓
Celery Receives Task
    ↓
Background Processing
    ↓
Progress Updates
    ↓
SUCCESS / FAILED / CANCELLED
    ↓
User Views Results
```

---

## 🛠️ Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* PostgreSQL
* Celery
* Redis
* SimpleJWT

### Frontend

* React
* TypeScript
* Vite
* React Router DOM
* Axios

---

# 📂 Project Structure

```text
JobFlow/
│
├── config/                 # Django project configuration
├── users/                  # User authentication app
├── jobs/                   # Job processing app
│
├── frontend/               # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── layouts/
│       └── types/
│
├── media/                  # Uploaded files
├── requirements.txt
├── manage.py
└── README.md
```

---

# ⚙️ Backend Setup

## 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd JobFlow
```

---

## 2. Create a Virtual Environment

### Windows

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create a `.env` file:

```env
DEBUG=True
SECRET_KEY=your-secret-key

DB_NAME=jobflow
DB_USER=jobflow_user
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

CELERY_BROKER_URL=redis://127.0.0.1:6379/0
CELERY_RESULT_BACKEND=redis://127.0.0.1:6379/1
```

> Do not commit your `.env` file to GitHub.

---

## 5. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 6. Create a Superuser

```bash
python manage.py createsuperuser
```

---

## 7. Run Django

```bash
python manage.py runserver
```

The backend will run at:

```text
http://127.0.0.1:8000
```

---

# 🔴 Redis Setup

Redis must be running before starting Celery.

Check Redis:

```bash
redis-cli ping
```

Expected output:

```text
PONG
```

---

# ⚙️ Celery Worker

On Windows, run Celery with:

```powershell
celery -A config worker --loglevel=info --pool=solo
```

Expected output:

```text
Connected to redis://127.0.0.1:6379/0
celery@YOUR-PC ready.
```

---

# 💻 Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will usually run at:

```text
http://localhost:5173
```

---

# 🔐 Authentication

JobFlow uses **JWT Authentication**.

## Login

```text
POST /api/token/
```

Request:

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

Response:

```json
{
  "access": "ACCESS_TOKEN",
  "refresh": "REFRESH_TOKEN"
}
```

The frontend stores tokens locally and sends authenticated requests using:

```text
Authorization: Bearer ACCESS_TOKEN
```

---

# 📋 API Endpoints

## Authentication

### Get JWT Token

```text
POST /api/token/
```

### Refresh Token

```text
POST /api/token/refresh/
```

---

## Users

```text
/api/users/
```

---

## Jobs

### List Jobs

```text
GET /api/jobs/
```

---

### Create Job

```text
POST /api/jobs/
```

The request supports CSV file uploads using:

```text
multipart/form-data
```

---

### Job Details

```text
GET /api/jobs/{id}/
```

---

### Cancel Job

```text
POST /api/jobs/{id}/cancel/
```

---

# 📊 Job Status

Jobs can have different statuses:

| Status       | Description                    |
| ------------ | ------------------------------ |
| `QUEUED`     | Job is waiting to be processed |
| `PROCESSING` | Job is currently running       |
| `SUCCESS`    | Job completed successfully     |
| `FAILED`     | Job processing failed          |
| `CANCELLED`  | Job was cancelled              |

---

# 📁 CSV Processing

Users can upload CSV files and create asynchronous processing jobs.

Example workflow:

```text
Upload CSV
    ↓
Create Job
    ↓
Send Task to Celery
    ↓
Process CSV
    ↓
Update Progress
    ↓
Save Result
```

The processing happens in the background, allowing the API to remain responsive.

---

# 🖥️ Frontend Pages

## Login

```text
/login
```

Users can authenticate using their username and password.

---

## Dashboard

```text
/dashboard
```

Displays:

* Total jobs
* Job statistics
* Processing jobs
* Successful jobs
* Failed jobs
* Recent jobs

---

## Jobs

```text
/jobs
```

Displays all jobs created by the authenticated user.

---

## Create Job

```text
/jobs/create
```

Allows users to:

* Select job type
* Select priority
* Upload a CSV file
* Create a background job

---

## Job Details

```text
/jobs/:id
```

Displays:

* Job information
* Current status
* Processing progress
* Job updates
* Results

---

# 🔄 Job Processing Lifecycle

```text
QUEUED
   ↓
PROCESSING
   ↓
SUCCESS
```

If an error occurs:

```text
QUEUED
   ↓
PROCESSING
   ↓
FAILED
```

A user can also request cancellation:

```text
QUEUED / PROCESSING
   ↓
CANCELLED
```

---

# 🧪 Running the Complete Application

You need multiple terminals running.

## Terminal 1 — Django

```powershell
cd JobFlow
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

---

## Terminal 2 — Celery

```powershell
cd JobFlow
.\venv\Scripts\Activate.ps1
celery -A config worker --loglevel=info --pool=solo
```

---

## Terminal 3 — Frontend

```powershell
cd JobFlow\frontend
npm run dev
```

---

## Terminal 4 — Redis

Make sure your Redis server is running.

---

# 🚧 Future Improvements

* [ ] Advanced job filtering
* [ ] Search and sorting
* [ ] Pagination
* [ ] Real-time updates with WebSockets
* [ ] Email notifications
* [ ] Job scheduling
* [ ] Docker deployment
* [ ] Kubernetes support
* [ ] Monitoring with Flower
* [ ] Unit and integration tests
* [ ] CI/CD pipeline
* [ ] Production deployment

---

# 🎯 Purpose of the Project

JobFlow was built as a portfolio project to demonstrate practical backend engineering concepts, including:

* REST API development
* JWT authentication
* Asynchronous task processing
* Background workers
* Message brokers
* Database design
* File uploads
* Job lifecycle management
* Progress tracking
* Retry mechanisms
* Full-stack API integration

---

# 👨‍💻 Author

**Nasim Khalili**

Computer Engineering Student | Backend Developer

