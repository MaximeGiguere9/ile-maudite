/**
 * Script controlant l'affichage des differentes sections du menu, selon les boutons cliques par l'utilisateur.
 */

#pragma strict

import UnityEngine.SceneManagement;

//les differentes sections du menu
var uiTitre:GameObject;
var uiIns:GameObject;
var uiCom:GameObject;
var uiScore:GameObject;
var uiFin:GameObject;
//les differents messages de fin de partie
var txtFinMort:GameObject;
var txtFinRapide:GameObject;
var txtFinMoyen:GameObject;
var txtFinLent:GameObject;
var txtInputNom:GameObject;
var txtInputNomMsg:GameObject;

function Start(){
	//si on revient d'une partie, on affiche la section de fin
	if(GestionnaireScore.scorePartie != "vide"){
		ChangerMenu(uiFin);
	} else{
		//sinon on affiche la section de titre
		ChangerMenu(uiTitre);
	}
}

/**
 * Change le menu a afficher selon le bouton clique
 * @param {GameObject} menu - le menu a afficher
 */
public function ChangerMenu(menu:GameObject){
	//desactive tous les menus
	uiTitre.SetActive(false);
	uiIns.SetActive(false);
	uiCom.SetActive(false);
	uiScore.SetActive(false);
	uiFin.SetActive(false);
	//active le menu choisi
	menu.SetActive(true);
	//les scores doivent etre prepares
	if(menu == uiScore)AfficherScores();
	if(menu == uiFin)GererMessageFin();
}

/**
 * Prepare et affiche le tableau des meilleurs scores
 */
function AfficherScores(){
	//supprime les entrees deja affichees
	while(GameObject.Find("EntreeScore(Clone)") != null){
		/*comme les objets sont normalement detruits a la fin de la frame,
		utiliser Destroy() ici forme une boucle infinie*/
		DestroyImmediate(GameObject.Find("EntreeScore(Clone)"));
	}
	//actualise les infos
	GestionnaireScore.AfficherListeScore();
}

/**
 * Demarre une partie
 */
public function Jouer(){
	SceneManager.LoadScene("Jeu");
}

/**
 * Extrait le nom du champ de texte et l'envoie a l'enregistrement
 * @param {GameObject} txtNom - le champ de saisie du nom
 */
public function EnregistrerScore(txtNom:GameObject){
	var nom = txtNom.GetComponent(UI.Text).text;
	if(nom == ""){
		//affiche le message d'erreur si le nom est vide
		txtInputNomMsg.SetActive(true);
	} else{
		//enregistre le score avec le nom
		txtInputNomMsg.SetActive(false);
		GestionnaireScore.Enregistrer(nom);
		ChangerMenu(uiScore);
	}
}

/**
 * Gere l'affichage des differents messages de fin selon la performance du joueur
 */
function GererMessageFin(){
	//messages differents si le joueur a reussi ou non
	if(GestionnaireScore.scorePartie == "mort"){
		//affiche le texte de mort
		txtFinMort.SetActive(true);
	}else{
		//cache un bouton qui apparaitrait derriere le bouton d'enregistrement
		GameObject.Find("/Canvas/UIFin/BtnRetour").SetActive(false);
		//affiche le texte de reussite selon le temps de la partie
		txtInputNom.SetActive(true);
		if(Joueur.tempsEcoule < 360){
			txtFinRapide.SetActive(true);
		}else if (Joueur.tempsEcoule < 540){
			txtFinMoyen.SetActive(true);
		}else{
			txtFinLent.SetActive(true);
		}
	}
}