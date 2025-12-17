# Fichier WSGI pour PythonAnywhere
# Copiez ce contenu dans votre fichier WSGI sur PythonAnywhere
# N'oubliez pas de remplacer 'votre-username' par votre vrai username !

import sys
import os

# Ajouter le chemin de votre projet
project_home = '/home/votre-username/portfolio'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Ajouter le chemin du venv pour les modules installés
venv_path = '/home/votre-username/portfolio/venv/lib/python3.10/site-packages'
if venv_path not in sys.path:
    sys.path.insert(0, venv_path)

# Charger les variables d'environnement
from dotenv import load_dotenv
load_dotenv(os.path.join(project_home, '.env'))

# Importer l'application Flask
from app import app as application

if __name__ == "__main__":
    application.run()

