/**
 * Script controlant la position de la camera de cinematique finale
 */

#pragma strict

var joueur:GameObject;
var positionRelative:Vector3;

function Awake () {
	joueur = GameObject.Find("/Joueur");
	gameObject.transform.position = joueur.transform.TransformPoint(positionRelative);
}

function Update () {
	//rotation autour du joueur
	gameObject.transform.LookAt(joueur.transform);
	gameObject.transform.Translate(Vector3.right*Time.deltaTime*5);
}

/**
 * Active la camera
 */
function ActiverCameraCinematique(){
	//verifie si la camera est deja active pour ne pas faire de changements plusieurs fois
	if(!gameObject.activeSelf){
		Camera.main.gameObject.SetActive(false);
		gameObject.SetActive(true);
	}
}