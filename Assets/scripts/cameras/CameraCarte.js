/**
 * Script controlant l'affichage de l'interface et de la camera de la carte,
 * ainsi que les changements dans l'eclairage et l'affichage des objets du monde 
 */

#pragma strict

//les cameras
var cameraPerso:GameObject;
var cameraCarte:GameObject;
//les interfaces
var uiJoueur:GameObject;
var uiCarte:GameObject;
//les power-ups
var powerUpLumiere:GameObject;
var powerUpCarte:GameObject;
var powerUpPotion:GameObject;
//la liste des objets interactifs
var conteneurObjets:GameObject;
private var listeObjets:Component[];

function Awake(){
	listeObjets = conteneurObjets.GetComponentsInChildren(Transform);
}

/**
 * Gere l'affichage des elements de la carte
 */
function ActiverCameraCarte(){
	//bascule entre la carte du jeu et la vue 3e pers
	cameraPerso.SetActive(!cameraPerso.activeSelf);
	cameraCarte.SetActive(!cameraCarte.activeSelf);
	
	//bascule l'affichage de l'interface de camera
	uiCarte.SetActive(!uiCarte.activeSelf);	
	
	/*cache les textes d'interaction si on n'est pas sur la camera du joueur
	(normalement InteractionObjet devrait etre vide de toute facon,
	sauf si certains objets interactifs ne sont pas dans le conteneur)*/
	uiJoueur.transform.Find("InteractionObjet").gameObject.SetActive(!uiCarte.activeSelf);
	//cache les objets interactifs si on visualise la carte
	conteneurObjets.SetActive(!uiCarte.activeSelf);
	
	if(uiCarte.activeSelf){
		//rafraichit les icones en les vidant et en les recreeant
		InterfaceJeu.ViderMarqueursCarte();
		//affiche le pointeur du perso sur la carte
		InterfaceJeu.AfficherPointeurPersoSurCarte(GameObject.Find("/Joueur"), "Vous êtes ici");
		//affiche des icones aux emplacements des objets si le joueur a le power-up correspondant
		if(Joueur.powerUpCarte){
			for (var i = 0; i < listeObjets.length; i++){
				InterfaceJeu.AfficherMarqueurCarte(listeObjets[i].gameObject, listeObjets[i].gameObject.tag);
			}
		}
	}
	
	//les indicateurs des power-ups
	powerUpLumiere.SetActive(Joueur.powerUpLumiere);
	powerUpCarte.SetActive(Joueur.powerUpCarte);
	powerUpPotion.SetActive(Joueur.powerUpPotion);
	
	
}