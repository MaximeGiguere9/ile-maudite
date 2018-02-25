/**
 * Script actualisant la position de texte sur l'interface 
 * par rapport a la position d'un objet sur l'ecran.
 */

#pragma strict

import UnityEngine.UI;

//l'objet sur lequel le texte doit s'afficher
var objetPivot:GameObject;

function Update () {
	//garde le texte au dessus-de l'objet
	gameObject.GetComponent(UI.Text).transform.position = Camera.main.WorldToScreenPoint(
		Vector3(objetPivot.transform.position.x,
				objetPivot.transform.position.y + objetPivot.GetComponentInChildren(Renderer).bounds.size.y + 0.5, 
				objetPivot.transform.position.z
		)
	);
}