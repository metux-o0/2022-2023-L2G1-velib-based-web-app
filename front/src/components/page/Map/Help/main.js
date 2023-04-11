import './main.css';
import zoomHelp from './images/help-zoom.png';
import SolutionzoomHelp from './images/solutionhelp-zoom.png';
import ErrorGPS from './images/GPSerreur.png';

export default function Main() {
    return (
        <div>
            <main>
                    <h2>Les potentielles difficultés d'affichage et les solutions:</h2>
                    <br></br>
                    <ol>
                        <li>
                            <p>
                                <strong>Difficulté:</strong> Votre position est activée, mais le PIN correspondant n'est pas visible sur la carte.
                            </p>
                            <br></br>
                            <img src={ErrorGPS} alt="Capture d'écran erreur GPS" className="GPSerreur-image"/>
                            <br></br>
                            <p>
                                <strong>Solution:</strong> Tout d'abord, assurez-vous que la localisation est bien activée sur votre appareil ou dans votre navigateur en cliquant sur "Afficher les informations du site" qui se situe à gauche de l'URL. Si elle est déjà activée, essayez de rafraîchir la page en appuyant sur la touche F5 de votre clavier ou en utilisant le bouton de rafraîchissement du navigateur. Si cela ne fonctionne pas, essayez de fermer et de rouvrir la page ou de redémarrer votre appareil. Si le problème persiste, contactez notre service d'assistance technique pour obtenir de l'aide supplémentaire.
                            </p>
                        </li>
                        <br></br>
                        <li>
                            <p>
                                <strong>Difficulté:</strong> L'affichage de la page semble peu esthétique et semble trop zoomé/pas assez zoomé, ce qui peut rendre la navigation difficile pour l'utilisateur et provoquer un mauvais affichage.
                            </p>
                            <br></br>
                            <p>Par exemple ici, la liste des vélos proches ne s'affiche pas entièrement sur l'écran:</p>
                            <br></br>
                            <img src={zoomHelp} alt="Capture d'écran aide zoom" className="zoom-image" />
                            <br></br>
                            <p>
                            <strong>Solution :</strong> Ajustez la taille du zoom de votre navigateur en positionnant votre souris sur la partie noire contenant le logo de l'application et le nom "CycloTrack", puis appuyez sur la touche "Ctrl" et utilisez la molette de votre souris pour zoomer ou dézoomer en fonction de votre préférence afin de régler ce problème. Vous pouvez également le faire manuellement en allant dans les paramètres de votre navigateur.
                            </p>
                            <p>Voici ce qui devrait s'afficher sur votre navigateur lorsque vous changez la taille du zoom :</p>
                            <img src={SolutionzoomHelp} alt="Solution aide zoom" className="zoom-image" />
                        </li>
                        <br></br>
                    </ol>
            </main>
        </div>


    );
}