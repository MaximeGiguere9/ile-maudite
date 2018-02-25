/**
 * Script contenant les methodes reliees a l'enregistrement et l'affichage des meilleurs scores.
 */

#pragma strict

import UnityEngine.UI;

//le prefab contenant les divisions de texte
static var PREFAB_SCORE:Object = Resources.Load("prefabs/EntreeScore");
//les noms des tableaux a chercher/enregistrer
static var NOM_TABLEAU_NOM:String = "Giguere_Maxime_TP_tableauNom";
static var NOM_TABLEAU_DATE:String = "Giguere_Maxime_TP_tableauDate";
static var NOM_TABLEAU_SCORE:String = "Giguere_Maxime_TP_tableauScore";
//les donnees du tableau
static var tableauNom = new String[11];
static var tableauDate = new String[11];
static var tableauScore = new String[11];
//le score de la partie
static var scorePartie:String = "vide";
//la date de la partie (utilisee pour identifier la partie actuelle unique dans la liste)
static var datePartie:String;


/**
 * Affiche les donnees de score dans le conteneur GameObject prevu a cet effet
 */
static function AfficherListeScore(){
	//l'objet dans lequel afficher les scores
	var txtScores = GameObject.Find("ListeScores");
	//charge ou actualise la liste
	GestionnaireScore.Rechercher();
	for(var i = 0; i < 10; i++){
		CreerObjetScore(txtScores, 10-i, 27*i);
	}
	//affiche le score de la partie actuelle meme si le joueur n'atteint pas les meilleurs scores
	if(tableauDate[0] == datePartie){
		CreerObjetScore(txtScores, 0, 290);
	}
	
}

/**
 * Instancie un GameObject contenant les donnees de score
 * @param {GameObject} parent - l'objet dans lequel afficher les scores
 * @param {int} index - l'index du score dans les tableaux
 * @param {int} offset - la position en +y par rapport au prefab
 */
static function CreerObjetScore(parent:GameObject, index:int, offset:int){
	var unScore:GameObject;
	//cree une zone pour entrer les donnees
	unScore = Instantiate(GestionnaireScore.PREFAB_SCORE as GameObject);
	unScore.transform.SetParent(parent.transform, false);
	unScore.transform.position.y -= offset;
	//affiche le score
	unScore.transform.Find("TxtNom").GetComponent(UI.Text).text = tableauNom[index];
	unScore.transform.Find("TxtDate").GetComponent(UI.Text).text = tableauDate[index];
	unScore.transform.Find("TxtScore").GetComponent(UI.Text).text = tableauScore[index];
	//surligne le score de la partie actuelle
	if(tableauDate[index] == datePartie){
		unScore.transform.Find("TxtNom").GetComponent(UI.Text).color = Color.white;
		unScore.transform.Find("TxtDate").GetComponent(UI.Text).color = Color.white;
		unScore.transform.Find("TxtScore").GetComponent(UI.Text).color = Color.white;
	}
}

/**
 * Cherche les donnees de score et les charge dans les tableaux
 */
static function Rechercher(){
	//si on trouve des donnees de score, on les charge
	if(PlayerPrefs.HasKey(GestionnaireScore.NOM_TABLEAU_NOM) &&
		PlayerPrefs.HasKey(GestionnaireScore.NOM_TABLEAU_DATE) &&
		PlayerPrefs.HasKey(GestionnaireScore.NOM_TABLEAU_SCORE)){
		
		tableauNom = PlayerPrefs2.GetStringArray(GestionnaireScore.NOM_TABLEAU_NOM);
		tableauDate = PlayerPrefs2.GetStringArray(GestionnaireScore.NOM_TABLEAU_DATE);
		tableauScore = PlayerPrefs2.GetStringArray(GestionnaireScore.NOM_TABLEAU_SCORE);
	
	} else {
		//sinon on cree des valeurs par defaut pour ne pas avoir de nulls
		for(var i = 0; i < 11; i++){
			tableauNom[i] = "(-vide-)";
			tableauDate[i] = "01/01/2000 12:00:00";
			tableauScore[i] = "0";
		}
	}
}

/**
 * Ajoute un nouveau score et trie la liste
 * @param {string} nom - le nom entre par le joueur
 */
static function Enregistrer(nom:String){
	if(nom == ""){
		nom = "Anonyme";
	}
	//charge ou actualise la liste
	GestionnaireScore.Rechercher();
	tableauNom[0] = nom;
	tableauDate[0] = datePartie;
	tableauScore[0] = scorePartie;
	//copie du tableau pour trier un 3e array
	var tableauScoreCopie = new String[11];
	System.Array.Copy(tableauScore, 0, tableauScoreCopie, 0, 11);
	//trie les tableaux selon le score
	System.Array.Sort(tableauScore, tableauNom);
	System.Array.Sort(tableauScoreCopie, tableauDate);
	//enregistre sur disque
	PlayerPrefs2.SetStringArray(GestionnaireScore.NOM_TABLEAU_NOM, tableauNom);
	PlayerPrefs2.SetStringArray(GestionnaireScore.NOM_TABLEAU_DATE, tableauDate);
	PlayerPrefs2.SetStringArray(GestionnaireScore.NOM_TABLEAU_SCORE, tableauScore);
}