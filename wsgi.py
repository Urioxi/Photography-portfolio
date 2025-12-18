# WSGI file for PythonAnywhere deployment
import sys
import os
from pathlib import Path

# Add the project directory to the Python path
project_dir = Path(__file__).parent
sys.path.insert(0, str(project_dir))

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    dotenv_path = os.path.join(project_dir, '.env')
    if os.path.exists(dotenv_path):
        load_dotenv(dotenv_path)
        print(f"Loaded .env from {dotenv_path}")
    else:
        print(f".env file not found at {dotenv_path}")
except ImportError:
    print("python-dotenv not installed, using environment variables")

# Import the Flask app
from app import app as application

# For debugging - uncomment if needed
# import logging
# logging.basicConfig(level=logging.DEBUG)
# application.logger.setLevel(logging.DEBUG)
