/**
 * Script instanciant des squelettes a des endroits aleatoires sur la carte
 */

#pragma strict

var tempsEcoule:float;
private var joueur:GameObject;
private var prefabSquelette:Object;

function Start () {
	tempsEcoule = 0;
	joueur = GameObject.Find("/Joueur");
	prefabSquelette = Resources.Load("prefabs/Squelette");
}

function Update () {
	//instancie un squelette a toutes les 5sec
	tempsEcoule += Time.deltaTime;
	if(tempsEcoule > 5){
		tempsEcoule = 0;
		CreerSquelette();
	}
}
/**
 * Instancie un squelette a un endroit aleatoire sur la carte
 */
function CreerSquelette(){
	//position aleatoire sur la carte
	var posX:float = Random.value*300 + 100;
	var posZ:float = Random.value*300 + 100;
	//pour trouver la hauteur du terrain
	var pointCollision:RaycastHit;
	Physics.Raycast(Vector3(posX, 1000, posZ), Vector3.down, pointCollision, 2000);
	//empeche de creer un squelette trop pres du joueur
	var distanceJoueur:Vector3 = pointCollision.point - joueur.transform.position;
	if(distanceJoueur.magnitude > 15){
		Instantiate(prefabSquelette as GameObject, pointCollision.point, Quaternion.identity);
	}
}