# Ward Information Finder

"Ward Information Finder" is a learning project aimed at building a backend-focused web application that helps users search for municipal ward details in Nepal. Built with Django Rest Framework, it features secure JWT-based authentication, dynamic filtering by location (Province, District, Local Level, Ward), and a clean API interface.

This project is ongoing and primarily focused on backend development practice.

## Features

-JWT Authentication & Authorization
-Filterable Ward Search:
   Province → District → Local Level → Ward
-Modular Django app structure with RESTful endpoints
-SQLite database with populated Nepali administrative divisions (for demo)

## Future Plans

-Google OAuth 2.0 login
-Google Maps integration for geolocation of wards
-More detailed locality information (population, services, facilities)
-Docker-based setup for easy deployment
-API documentation with Swagger or Redoc

## Installation & Setup

> Requires Python 3.8+, pip, and virtualenv (recommended)

```bash
# Clone the repo
git clone https://github.com/ryabi/Ward-Information-Finder.git
cd Ward-Information-Finder

# Create and activate virtual environment
python -m venv env
source env/bin/activate  # or env\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations and start the server
python manage.py migrate
python manage.py runserver
```

## API Authentication
This project uses JWT for securing API endpoints. After logging in, include the token in the Authorization header like this:
```bash
Authorization: Bearer <your_access_token>
```
## Project Structure
```bash
Ward-Information-Finder/
├── api/                # DRF views, serializers, and URLs
├── myproject/               # Main App
├── login/          #App to handel all authentication and authorization
├── manage.py
└── requirements.txt

