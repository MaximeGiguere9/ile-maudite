/**
 * Script contenant des fonctionnalites supplementaires pour faciliter 
 * les tests et le debug du projet.
 */

#pragma strict

//determine l'endroit ou le joueur sera teleporte
private var tpIndex:int;
//acces aux fonctions de ce script
var actif:boolean;

function Start () {
	tpIndex = 0;
	actif = false;
}

function Update () {
		//active ou desactive l'acces aux foncionnalites
		if(Input.GetKeyDown(KeyCode.T)){
			actif = !actif;
			Debug.Log("Fonctions de Debug activées : " + actif);
		}
	
		if(actif){
			//active tous les power-ups
			if(Input.GetKeyDown(KeyCode.X)){
				Joueur.powerUpPotion = true;
				Joueur.powerUpCarte = true;
				Joueur.powerUpLumiere = true;
			}
			//teleporte pres des artefacts
			if(Input.GetKeyDown(KeyCode.C)){
				Teleporter();
			}
			//remplit les PDV
			if(Input.GetKeyDown(KeyCode.V)){
				GetComponent(Joueur).pointsVie = GetComponent(Joueur).pointsVieMax*1000000;
				Debug.Log("Points de vie +1milliard.");
			}
			//vide les donnees de scores
			if(Input.GetKeyDown(KeyCode.B)){
				PlayerPrefs.DeleteKey(GestionnaireScore.NOM_TABLEAU_NOM);
				PlayerPrefs.DeleteKey(GestionnaireScore.NOM_TABLEAU_SCORE);
				PlayerPrefs.DeleteKey(GestionnaireScore.NOM_TABLEAU_DATE);
				Debug.Log("Données de scores supprimées.");
			}
		}

}

/**
 * teleporte le joueur pres d'un des artefact
 */
function Teleporter(){
	var destination:GameObject;
	tpIndex ++;
	switch (tpIndex%5){
		case 0:
			destination = GameObject.Find("/Monde/Base");
			break;
		case 1:
			destination = GameObject.Find("/Monde/Montagne");
			break;
		case 2:
			destination = GameObject.Find("/Monde/Plage");
			break;
		case 3:
			destination = GameObject.Find("/Monde/Marais");
			break;
		case 4:
			destination = GameObject.Find("/Monde/Plaine");
			break;
	}
	gameObject.transform.position = destination.transform.position;
}