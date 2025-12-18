# Déploiement sur PythonAnywhere

## Étapes de déploiement

### 1. Créer un compte PythonAnywhere
- Allez sur https://www.pythonanywhere.com/
- Créez un compte gratuit

### 2. Ouvrir une console Bash
- Dans votre dashboard PythonAnywhere, cliquez sur "Consoles" puis "Bash"

### 3. Cloner votre repository
```bash
git clone https://github.com/votre-utilisateur/portfolio.git
cd portfolio
```

### 4. Créer un environnement virtuel
```bash
python3 -m venv venv
source venv/bin/activate
```

### 5. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 6. Configuration des variables d'environnement
- Copiez votre fichier `.env` dans le répertoire du projet
- Ou configurez les variables dans l'interface web PythonAnywhere :
  - Allez dans "Web" > "Variables"
  - Ajoutez :
    ```
    CLOUDINARY_CLOUD_NAME=votre_valeur
    CLOUDINARY_API_KEY=votre_valeur
    CLOUDINARY_API_SECRET=votre_valeur
    SECRET_KEY=votre_cle_secrete
    ADMIN_PASSWORD=admin123
    ```

### 7. Configuration de l'application web
- Allez dans "Web" > "Add a new web app"
- Choisissez "Flask" et Python 3.x
- Dans "WSGI configuration file", mettez : `/home/votre-utilisateur/portfolio/wsgi.py`
- Dans "Source code", mettez : `/home/votre-utilisateur/portfolio`
- Dans "Working directory", mettez : `/home/votre-utilisateur/portfolio`

### 8. Configuration des fichiers statiques
- Dans "Web" > "Static files" :
  - URL: `/static`
  - Directory: `/home/votre-utilisateur/portfolio/statics`

### 9. Redémarrer l'application
- Cliquez sur "Reload" dans l'interface web

## Dépannage

### Erreur "No module named 'app'"
- Vérifiez que le fichier `wsgi.py` pointe vers le bon répertoire
- Assurez-vous que `app.py` est dans le répertoire racine

### Erreur "Cloudinary not configured"
- Vérifiez que les variables d'environnement sont correctement définies
- Redémarrez l'application après avoir modifié les variables

### Erreur 500 au démarrage
- Vérifiez les logs dans "Web" > "Error log"
- Assurez-vous que tous les fichiers sont présents

### Problèmes d'upload d'images
- Les connexions sortantes HTTPS sont bloquées sur PythonAnywhere
- L'upload direct vers Cloudinary depuis le navigateur devrait fonctionner
- Si ça ne marche pas, vérifiez les clés API Cloudinary

## Variables d'environnement requises
```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SECRET_KEY=...
ADMIN_PASSWORD=admin123
```
