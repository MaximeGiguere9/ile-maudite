/**
 * Script gerant la lumiere du joueur
 */


#pragma strict

//duree totale de la lumiere
var dureeLumiere:float;
//duree restante
var dureeRestante:float;
//valeur initiale de la variable du component
private var intensiteInitiale:float;

function Start(){
	//initialise la duree
	dureeRestante = dureeLumiere;
	//augmente la duree si le joueur a le power up correspondant
	if(Joueur.powerUpLumiere){
		dureeRestante *= 1.5;
		Debug.Log("Super Torche!");
	}
	intensiteInitiale = gameObject.GetComponent(Light).intensity;
}

function Update () {
	dureeRestante -= Time.deltaTime;
	//diminue graduellement l'intensite de la lumiere
	if(dureeRestante > 0){
		gameObject.GetComponent(Light).intensity = 2.5 + (dureeRestante/dureeLumiere)*(intensiteInitiale-2.5);
	}else{
		gameObject.GetComponent(Light).intensity -= Time.deltaTime;
	}
	//affiche le temps restatnt sur l'interface
	GameObject.Find("/UIJoueur/LumBarre").GetComponent(UI.Image).fillAmount = dureeRestante/dureeLumiere;
	//supprime l'objet quand l'intensite est a 0
	if(gameObject.GetComponent(Light).intensity <= 0){
		Destroy(gameObject);
	}
}