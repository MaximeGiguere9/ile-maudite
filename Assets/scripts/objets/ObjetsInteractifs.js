/**
 * Script contenant les comportements de tous les objets interactifs
 */

#pragma strict

//variable pour identifier le type de l'objet (dans l'inspecteur)
var typeObjet:String;
//le texte qui s'affiche a l'ecran quand le joueur s'approche (dans l'inspecteur)
var texteInteraction:String;
//si le joueur est pres de l'objet
private var joueurAProximite:boolean;

function Start () {
	joueurAProximite = false;
}

function OnTriggerEnter(collider:Collider){
	//affiche un message sur l'interface si le joueur est a proximite
	if(collider.gameObject.tag == "Player"){
		InterfaceJeu.AfficherInteractionObjet(gameObject, texteInteraction);
		joueurAProximite = true;
	}
}

function OnTriggerExit(collider:Collider){
	//supprime le message sur l'interface si le joueur s'eloigne
	if(collider.gameObject.tag == "Player"){
		InterfaceJeu.MasquerInteractionObjet(gameObject);
		joueurAProximite = false;
	}
}

//si on reactive l'objet quand le joueur est a proximite, OnTriggerEnter() est appele
//par contre, OnTriggerExit() n'est pas appele quand on le desactive
//(OnDisable() est aussi appele quand on sort du play mode, ce qui cause une MissingReferenceException dans ce cas-ci)
function OnDisable(){
	if(joueurAProximite){
		InterfaceJeu.MasquerInteractionObjet(gameObject);
		joueurAProximite = false;
	}
}

function Update(){
	//si le joueur interagit avec l'objet...
	if(joueurAProximite && Input.GetKeyDown(Joueur.CONTROLES_INTERAGIR)){
		//...on execute la fonction qui lui donne son comportement 
		switch(typeObjet){
			case "Artefact":
				ActiverArtefact();
				break;
			case "Torche":
				CreerLumiere();
				break;
			case "Super Torche":
				OuvrirCoffre();
				Joueur.powerUpLumiere = true;
				break;
			case "Carte":
				OuvrirCoffre();
				Joueur.powerUpCarte = true;
				break;
			case "Potion":
				OuvrirCoffre();
				Joueur.powerUpPotion = true;
				break;
			case "#":
				break;
			default:
				Debug.Log("Aucun comportement défini pour l'objet "+typeObjet);
				break;
		}
	}
}

/**
 * Change l'etat de l'artefact
 */
function ActiverArtefact(){
	GetComponent(AudioSource).Play();
	//active l'artefact
	GetComponent(Animator).SetBool("actif", true);
	//traque l'objectif sur le joueur
	Joueur.nbArtefactsActifs ++;
	//supprime le texte
	InterfaceJeu.MasquerInteractionObjet(gameObject);
	//empeche le joueur d'activer le meme artefact plusieurs fois
	Destroy(this);
}

/**
 * place une lumiere sur le joueur (ou la rafraichit) quand il interagit avec une torche
 */
function CreerLumiere(){
	//cherche et detruit la lumiere existante
	var lum = GameObject.Find("/Joueur/torcheJoueur(Clone)");
	if(lum != null)Destroy(lum);
	//place une lumiere sur le joueur
	lum = Instantiate(Resources.Load("prefabs/torcheJoueur")) as GameObject;
	lum.transform.parent = GameObject.Find("/Joueur").transform;
	lum.transform.position = GameObject.Find("/Joueur").transform.position + (Vector3.up*2 + Vector3.forward/2);
}

/**
 * Change l'etat du coffre
 */
function OuvrirCoffre(){
	GetComponent(AudioSource).Play();
	GetComponent(Animator).SetBool("ouvert", true);
	//message annoncant l'objet obtenu
	texteInteraction = typeObjet + " obtenu(e).";
	//actualise le texte
	InterfaceJeu.MasquerInteractionObjet(gameObject);
	InterfaceJeu.AfficherInteractionObjet(gameObject, texteInteraction);
	//empeche le joueur d'activer le meme coffre plusieurs fois
	typeObjet = "#";
	
}