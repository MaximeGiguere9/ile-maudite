/**
 * Script controlant le comportement du squelette
 */

#pragma strict
//les components utilises
var nav:NavMeshAgent;
var anim:Animator;
//le joueur et la distance avec lui
var joueur:GameObject;
var distance:Vector3;
//pour que les animations de fin jouent correctement
private var enAnimFin:boolean;

function Start () {
	nav = GetComponent(NavMeshAgent);
	joueur = GameObject.Find("/Joueur");
	anim = GetComponent(Animator);
	enAnimFin = false;
}

function Update () {
	//determine la distance entre le joueur et le squelette
	distance = gameObject.transform.position - joueur.transform.position;
	//distance d'agression
	if(distance.magnitude < 1){
		nav.ResetPath();
		anim.SetTrigger("attaque");
	}else if(distance.magnitude < 25){
		nav.SetDestination(joueur.transform.position);
	}else{
		if(nav.hasPath)nav.ResetPath();
	}
	if(!enAnimFin){
		//si le joueur est mort
		if(!Joueur.enVie){
			if(nav.hasPath)nav.ResetPath();
			anim.SetTrigger("dance");
			enAnimFin = true;
		}
		//si l'ile est totalement purifiee
		if(Joueur.nbArtefactsActifs == 5){
			if(nav.hasPath)nav.ResetPath();
			nav.speed = 0;
			anim.SetTrigger("mort");
			enAnimFin = true;
		}
	}
	//anim si le squelette se deplace
	anim.SetBool("enMouvement", nav.hasPath);
}