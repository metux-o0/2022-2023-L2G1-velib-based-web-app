## Etape 1 - Installer Visual Studio Code.

## Etape 2 - Installer Git.

## Etape 3 - Installer add-ons de Visual Studio Code :
		a. Ouvrez Visual Studio Code.
		b. Accédez au menu des add-ons et recherchez l'add-ons suivant : Javascript 6.

## Etape 4 - Cloner le projet :
		a: creer un dossier sur le bureau "Application"
		b: Ouvrir le terminal dans Visual Studio Code et acceder à ce dossier
		c: Coller "git clone https://github.com/metux-o0/2022-2023-L2G1-velib-based-web-app.git"

## Etape 5 - Installer Node.js 

## Etape 6 - Installer React.js :
		a: Ouvrez une fenêtre de terminal et accédez au dossier de votre projet.
		b: Tapez la commande suivante dans le terminal : "npm install --save react-dom".


## Etape 7 - Modifier le code dans "Back/src/services/MongoDBlink" :
	
		a: Remplacez "mongodb+srv://NomUser:mdp@test.ppkdbye.mongodb.net/?retryWrites=true&w=majority" par le code spécifique requis pour se connecter à votre base de données MongoDB.

## Etape 8 - Modifier le code dans "front/src/components/page/Map" :
		a: Creer un fichier apiKey.js.
		b: coller ce code:
	
			Const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="Google api key";
			export default NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

		c: Remplacez "Google api key" par la clé d'API Google Maps spécifique à votre projet.

## Etape 9 - Installer les dépendances du back-end :
		a: Ouvrez une fenêtre de terminal et accédez au dossier "Back" de votre projet.
		b: Tapez la commande suivante dans le terminal : "npm i".
		c: Attendez que l'installation soit terminée.
		d: Tapez la commande suivante dans le terminal : "node app".
		e: Attendez que le back-end affiche "tout est bon" dans la console.

## Etape 10 - Installer les dépendances du front-end :
		a: Ouvrez une fenêtre de terminal et accédez au dossier "front" de votre projet.
		b: Tapez la commande suivante dans le terminal : "npm i".
		c: Attendez que l'installation soit terminée.
		d: Tapez la commande suivante dans le terminal : "npm start".

Le recettage est terminé. Vérifiez que l'application fonctionne correctement.
