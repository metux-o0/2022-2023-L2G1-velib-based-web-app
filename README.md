1 :Installer Visual Studio Code :

2- Installer Git :

3- Installer add-ons de Visual Studio Code :
	a: Ouvrez Visual Studio Code.
	b: Accédez au menu des add-ons et recherchez l'add-ons suivant : Javascript 6.

4-Cloner le projet :
	a: creer un dossier sur le bureau "Application"
	b: Ouvrir le terminal dans Visual Studio Code et acceder à ce dossier
	c: Coller "git clone https://github.com/metux-o0/2022-2023-L2G1-velib-based-web-app.git"

5- Installer Node.js 

6- Installer React.js :
	a: Ouvrez une fenêtre de terminal et accédez au dossier de votre projet.
	b: Tapez la commande suivante dans le terminal : "npm install --save react-dom".


7- Modifier le code dans "Back/src/services/mongoose" :
	a: Ouvrez le fichier "mongoose.js" dans le dossier "services" du dossier "Back" de votre projet.
	b: Allez à la ligne 4 dans la méthode mongoose.connect().
	c: Remplacez "mongodb+srv://NomUser:mdp@test.ppkdbye.mongodb.net/?retryWrites=true&w=majority" par le code spécifique requis pour se connecter à votre base de données MongoDB.

8- Modifier le code dans "front/src/components/page/Map/APP" :
	a: Allez à la ligne 358.
	b: Dans la variable GoogleMapsApiKey remplacez "Google api key" par la clé d'API Google Maps spécifique à votre projet.

9- Installer les dépendances du back-end :
	a: Ouvrez une fenêtre de terminal et accédez au dossier "Back" de votre projet.
	b: Tapez la commande suivante dans le terminal : "npm i".
	c: Attendez que l'installation soit terminée.
	d: Tapez la commande suivante dans le terminal : "node app".
	e: Attendez que le back-end affiche "tout est bon" dans la console.

10- Installer les dépendances du front-end :
	a: Ouvrez une fenêtre de terminal et accédez au dossier "front" de votre projet.
	b: Tapez la commande suivante dans le terminal : "npm i".
	c: Attendez que l'installation soit terminée.
	d: Tapez la commande suivante dans le terminal : "npm start".
