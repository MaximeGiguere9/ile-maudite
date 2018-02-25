/**
 * Classe permettant l'affichage dynamique de texte ou d'image relie a un objet pendant l'execution
 */

#pragma strict

import UnityEngine.UI;

//les canvas dans lesquels afficher les elements crees par cette classe
static var uiTexteObjet:GameObject;
static var uiMarqueurCarte:GameObject;

function Update(){
	//essaie de trouver les objets avec Find() si une des deux variables est null
	//(peut etre long car il est necessaire que le joueur ouvre la carte pour trouver uiMarqueurCarte)
	if(uiTexteObjet == null || uiMarqueurCarte == null){
		VerifierDependances();
	}
}

/**
 * S'assure que uiTexteObjet et uiMarqueurCarte pointent toujours vers le bon objet,
 * meme si l'un d'eux est inactif (car on ne peut pas simplement les lier dans l'inspecteur).
 */
static function VerifierDependances(){
	//stocke temporairement l'objet pour verifier s'il est null 
	var trouveObjet:GameObject;
	
	trouveObjet = GameObject.Find("UIJoueur/InteractionObjet");
	if(trouveObjet != null)uiTexteObjet = trouveObjet;
	
	trouveObjet =GameObject.Find("UICarte/Marqueurs");
	if(trouveObjet != null)uiMarqueurCarte = trouveObjet;
}

/**
 * Affiche du texte a la position d'un objet
 * @param {GameObject} objet - l'objet de reference
 * @param {String} texte - le texte a afficher
 * @return {GameObject} l'objet qui contient le texte affiche a l'ecran
 */
static function AfficherInteractionObjet(objet:GameObject, texte:String):GameObject{
	//creation du texte
	//objet et rectangle
	var objTxt:UI.Text = new GameObject().AddComponent(UI.Text);
	objTxt.gameObject.name = objet.name;
	objTxt.rectTransform.sizeDelta = Vector2(200, 20);
	objTxt.transform.SetParent(uiTexteObjet.transform);
	//texte
	objTxt.font = Resources.GetBuiltinResource(typeof(Font), "Arial.ttf");
	objTxt.color = Color.white;
	objTxt.text = texte;
	objTxt.alignment = TextAnchor.UpperCenter;
	//script qui actualise la position du texte sur l'ecran
	var txtPos = objTxt.gameObject.AddComponent(PositionTexte);
	txtPos.objetPivot = objet;
	
	return objTxt.gameObject;
}

/**
 * Supprime le texte forme par AfficherInteractionObjet
 * @param {GameObject} objet - l'objet de reference
 * @see #AfficherInteractionObjet(GameObject, String)
 */
static function MasquerInteractionObjet(objet:GameObject){
	//trouve le texte cree par objet dans les enfants de uiTexteObjet et le supprime
	Destroy(uiTexteObjet.transform.Find(objet.name).gameObject);
}

/**
 * Supprime tous les textes formes par AfficherInteractionObjet
 * @see #AfficherInteractionObjet(GameObject, String)
 */
static function ViderInteractionObjet(){
	while (uiTexteObjet.transform.childCount > 0){
		/*comme les objets sont normalement detruits a la fin de la frame,
		utiliser Destroy() ici forme une boucle infinie*/
		DestroyImmediate(uiTexteObjet.transform.GetChild(0).gameObject);
	}
}

/**
 * Affiche une icone a l'emplacement d'un objet (similaire a AfficherInteractionObjet, mais avec une icone sur la carte)
 * @param {GameObject} objet - l'objet de reference
 * @param {String} type - le nom de l'objet
 * @see #AfficherInteractionObjet(GameObject, String)
 */
static function AfficherMarqueurCarte(objet:GameObject, type:String){
	//elimine les objets sans tags (generalement vides)
	if(type != "Untagged"){
		//message plus specifique que les erreurs de Unity
		var prefabObj = Resources.Load("prefabs/Marqueur"+type);
		if(prefabObj == null){
			Debug.Log("Objet "+objet.name+" de type "+type+" ne possède pas de marqueur.");
			return;
		}
		//creation de l'icone
		var objImg:GameObject = Instantiate(prefabObj) as GameObject;
		objImg.transform.SetParent(uiMarqueurCarte.transform);
		objImg.transform.position = Camera.main.WorldToScreenPoint(objet.transform.position);
	}
}

/**
 * Supprime tous les marqueurs d'objets sur la carte
 * @see #AfficherMarqueurCarte(GameObject, String)
 */
static function ViderMarqueursCarte(){
	//il est possible que cette fonction soit appelee avant que Update() puisse trouver uiMarqueurCarte
	//cette precaution permet de s'assurer que uiMarqueurCarte n'est pas null
	VerifierDependances();
	
	while (uiMarqueurCarte.transform.childCount > 0){
		/*comme les objets sont normalement detruits a la fin de la frame,
		utiliser Destroy() ici forme une boucle infinie*/
		DestroyImmediate(uiMarqueurCarte.transform.GetChild(0).gameObject);
	}
}

/**
 * Affiche une icone a l'emplacement d'un objet (similaire a AfficherInteractionObjet, mais avec une icone sur la carte)
 * @param {GameObject} objet - l'objet de reference
 * @param {String} type - le nom de l'objet
 * @see #AfficherInteractionObjet(GameObject, String)
 */
static function AfficherPointeurPersoSurCarte(objet:GameObject, texte:String){
	var pointeur = AfficherInteractionObjet(objet, texte);
	pointeur.transform.SetParent(uiMarqueurCarte.transform);
}