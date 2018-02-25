/**
 * Classe traquant les stats du joueur et permettant de controler l'avatar
 */

#pragma strict

import UnityEngine.SceneManagement;



//controles
static var CONTROLES_INTERAGIR:KeyCode = KeyCode.E;
static var CONTROLES_CARTE:KeyCode = KeyCode.M;
//components
private var bodyPerso:Rigidbody;
private var animPerso:Animator;
//cameras
var cameraCarte:CameraCarte;
var cameraFin:CameraCinematique;
//variables reliees aux points de vie...
static var enVie:boolean;
var pointsVieMax:int = 100;
var pointsVie:float;
//... et a leur vitesse de reduction
var vitesseCorruption:float = 0;
var zoneSure:boolean;
//affichage des stats
private var barreVie:UI.Image;
private var barreObjectif:UI.Image;
//objectifs
static var powerUpLumiere:boolean;
static var powerUpCarte:boolean;
static var powerUpPotion:boolean;
static var nbArtefactsActifs:float;
static var tempsEcoule:float;
//variable qui previent d'appeler les fonctions de transitions plusieurs fois
private var enTransition:boolean;

function Start () {
	//(re)initialisation des stats
	tempsEcoule = 0;
	powerUpLumiere = false;
	powerUpCarte = false;
	powerUpPotion = false;
	nbArtefactsActifs = 0;
	pointsVie = pointsVieMax;
	enTransition = false;
	enVie = true;
	
	//chercher les autres components necessaires
	bodyPerso = GetComponent(Rigidbody);
	animPerso = GetComponent(Animator);
	barreVie = GameObject.Find("/UIJoueur/PDVBarre").GetComponent(UI.Image);
	barreObjectif = GameObject.Find("/UIJoueur/NbArtefactBarre").GetComponent(UI.Image);
}

function Update () {

	if(enTransition){
		cameraFin.ActiverCameraCinematique();
	}else{
		tempsEcoule += Time.deltaTime;
		//gestion des deplacements
		animPerso.SetFloat("Forward", Input.GetAxis("Vertical"));
		animPerso.SetFloat("Turn", Input.GetAxis("Horizontal")/3);
		//rotation additionnelle (inversee si on recule)
		bodyPerso.transform.Rotate(0, Input.GetAxis("Horizontal")*Input.GetAxis("Vertical"), 0);
		//controle pour afficher la carte
		if(Input.GetKeyDown(CONTROLES_CARTE)){
			cameraCarte.ActiverCameraCarte();
		}
		//gestion des PDV
		ActualiserPointsVie();
		//affichage de la progression
		barreObjectif.fillAmount = nbArtefactsActifs/5;
		//termine la partie si tous les artefacts sont actifs ou si le joueur arrive a court de PDV
		if(!enTransition && (nbArtefactsActifs == 5 || pointsVie <= 0)){
			TerminerPartie(pointsVie <= 0);
		}
	}
	
	//noie le joeuur s'il se rend sous l'eau
	if(gameObject.transform.position.y < 31){
		pointsVie = 0;
	}

}

function OnCollisionEnter(collision:Collision){
	if(collision.gameObject.tag == "Zone Sure"){
		zoneSure = true;
	}
}
function OnCollisionExit(collision:Collision){
	if(collision.gameObject.tag == "Zone Sure"){
		zoneSure = false;
	}
}
//PDV diminuent quand le joueur est en contact avec un squelette
function OnCollisionStay(collision:Collision){
	if(collision.gameObject.tag == "Squelette"){
		pointsVie -= 0.5;
	}
}



/**
 * Calcule et affiche les PDV
 */
function ActualiserPointsVie(){
	//les PDV diminuent si le joueur s'eloigne des artefacts (zoneSure) sans lumiere (torcheJoueur)
	if(transform.Find("torcheJoueur(Clone)") == null && !zoneSure){
		if(vitesseCorruption < 0){
			vitesseCorruption = 0;
		}else{
			vitesseCorruption += Time.deltaTime/2;
		}
		pointsVie -= vitesseCorruption*Time.deltaTime;
	} else{
		//la vitesse de reduction des PDV diminue jusqu'a 0
		if(vitesseCorruption > 0){
			vitesseCorruption -= Time.deltaTime*2;
		}else{
			vitesseCorruption = 0;
			//soigne si la vitesse de corruption est 0 et le joueur a obtenu la potion
			if(Joueur.powerUpPotion){
				pointsVie += Time.deltaTime;
			}
		}
		
		
	}
	//actualise l'element visuel
	barreVie.fillAmount = pointsVie/pointsVieMax;
}

/**
 * Calcule le score selon le temps ecoule et les PDV, et retourne vers le menu
 */
function TerminerPartie(mort:boolean){
	enTransition = true;
	var scoreMax:float = 1500000;
	var scorePartie:int;
	//date pour identifier la partie
	GestionnaireScore.datePartie = System.DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
	if(mort){
		Joueur.enVie = false;
		//indique que le joueur est mort
		GestionnaireScore.scorePartie = "mort";
		animPerso.SetTrigger("mort");
	}else{
		animPerso.SetTrigger("dance");
		//calcule le score
		if(tempsEcoule < 360){//<6m
			scorePartie = scoreMax - tempsEcoule*1111;
		}else if(tempsEcoule < 540){//6-9m
			scorePartie = scoreMax - tempsEcoule*1222;
		}else{//>9m
			scorePartie = Mathf.Clamp(scoreMax - tempsEcoule*1333, 0, scoreMax);
		}
		GestionnaireScore.scorePartie = scorePartie.ToString();
		
	}
	yield WaitForSeconds(5);
	SceneManager.LoadScene("Menu");
}