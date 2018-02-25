/**
 * Script controlant des options de rendu qui sont changees pendant l'execution
 */

#pragma strict

//elements a changer
var terrain:Terrain;
var lumiere:Light;
//points de reference pour les changements
var cameraCarte:GameObject;
var joueur:GameObject;
var hauteurReferenceBase:float;

function Update () {
	//si on est sur la camera de la carte, l'eclairage est plus fort pour permettre une meilleure visibilite
	lumiere.intensity = (cameraCarte.activeSelf)? 1.5 : 0.1;
	//brouillard diminue avec l'elevation (meilleure vue sur la montagne)
	RenderSettings.fogDensity = (hauteurReferenceBase/joueur.transform.position.y)*0.01f;
	/* les arbres sont tous reveles sur la camera carte, sinon la distance d'affichage 
	des arbres augmente avec la hauteur pour une meilleur vue sur la montagne */
	terrain.treeDistance = (cameraCarte.activeSelf)? 2000 : 200 * (joueur.transform.position.y/hauteurReferenceBase);
	//les arbres sont rendus en billboard sur la camera carte pour une meilleur performance
	terrain.treeBillboardDistance = (cameraCarte.activeSelf)? 5 : 30;
}