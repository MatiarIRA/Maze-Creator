/*
Fichier:	labyrinthe.js
Auteurs:	Louis-Edouard LAFONTANT et
			Mohammad Hossein ERFANIAN AZMOUDEH

Ce programme permet de construire un labyrinthe
*/

//fonction iota: rempli un tableau de n entier de 0 à n-1
function iota(n){
    var tab = Array(n); //initialise un tableau de taille n
    
    //rempli le tableau: tab[0] = 0; tab[1] = 1 ... tab[n-1] = n-1
    for (var i = 0; i < n; i++)
        tab[i] = i;
    
    return tab;
}


//fonction contient: verifie si un tableau contient une valeur
function contient(tab, x){
    var trouve = false; //variable reponse disant si la valeur est trouve ou pas dans le tableau
    var sortedTab = tab.slice(); //copie independant du tableau recu en parametre
    var tabLength = sortedTab.length;
    
    //verifie si le tableau est vide
    if (tabLength > 0) { //tableau de taille > 0
        
        //tri le tableaue en ordre croissant
        sortedTab.sort(function (a, b) {
            return (a - b);
        });
        
        //debut de l'algorithme de dichotomie (binary search)
        var debut = 0;
        var fin = tabLength - 1;
        var milieu = Math.floor((debut + fin + 1) / 2);
        
        do {
            if (x == sortedTab[milieu])
                trouve = true;
            else if (x < sortedTab[milieu])
                fin = milieu - 1;
            else
                debut = milieu + 1;
            milieu = Math.floor((debut + fin + 1) / 2);
        } while ((debut <= fin) && !trouve);
    }
    
    return trouve;
}

//fonction ajouter: ajoute une valeu a un tableau s'il ne contient pas la valeur
function ajouter(tab, x){
    //si le tableau ne contient pas la valeur, ajouter celle-ci au tableau
    if (!contient(tab, x))
        tab.push(x);
    
    return tab;
}


//fonction retirer: supprime une valeur d'un tableau
function retirer(tab, x){
    //verifie si le tableau contient la valeur
    if (contient(tab, x)) {//si oui
        var tabLength = tab.length; //taille du tableau passé en paramètre (t)
        var tab1 = Array(tabLength - 1); // creation de tableau de taille t-1 (1 valeur en moins)
        var compteur;
        
        //remplissage du tableau jusqu'à ce qu'on rencontre la valeur à supprimer (n'est pas ajouté)
        for (compteur = 0; compteur < tabLength; compteur++){
            if (tab[compteur] == x){// si valeur du tableau = valeur a supprimé, quitté la boucle
                break;
            }
            tab1[compteur] = tab[compteur];
        }
        //ajout des valeurs restantes
        while(++compteur < tabLength)
            tab1[compteur - 1] = tab[compteur];
        
        return tab1;
    }
    else
        return tab;
}

//fonction voisins: recherche les cellules voisines de celle passé en paramètre
function voisins(x, y, nx, ny){
    var tab = [];
    var cellule = x + y * nx; //numéro de la cellule d'après ses coordonnées (x, y)
    
    //si x est inférieur à nx-1 ajout cellule de droite (est)
    if (x < nx - 1)
        tab.push(cellule + 1);
    //si x est supérieur à 0 ajout cellule de gauche (ouest)
    if (x > 0)
        tab.push(cellule - 1);
    //si y est inférieur à ny-1 ajout cellule du bas (sud)
    if (y < ny - 1)
        tab.push(cellule + nx);
    //si y est supérieur à 0 ajout cellule du haut (nord)
    if (y > 0)
        tab.push(cellule - nx);
    
    return tab;
}


//procédure laby: construit le labyrinthe
function laby(nx, ny, pas){
    var nbCellule = nx * ny; //nombre de cellules dans le labyrinthe
    var mursH = iota(nx * (ny + 1)); //ensemble des murs horizontaux
    var mursV = iota(ny * (nx + 1)); //ensemble des murs verticaux
    mursH = mursH.slice(1, mursH.length - 1); //creation entrée et sortie du labyrinthe
    var nord, sud, ouest, est;
    var cave = [];
    var front = [];
    
    //CREATION DE LA CAVITÉ
    
    //initialisation de la cavité
    while (true) {
        nord = Math.floor(Math.random() * nbCellule);
        //vérifie que la cellule ne fait pas partie du bord du labyrinthe
        if ((nord > nx) && (nord % nx != 0) && (nord < nx * (ny - 1)) && ((nord + 1) % nx != 0))
            break;
    }
    cave.push(nord); // Cavité initialisée
    
    //complètement de la cavité
    var index = 0;
    var caveLength = cave.length - 1;
    while (++caveLength < nbCellule) {
        //remplir front
        do {
            var caveIndex = cave[index];
            var temp = voisins(caveIndex % nx, Math.floor(caveIndex / nx), nx, ny);
            //Ajouter les cellules voisines des cellules de la cavité, qui ne font pas parti
            //de la cavité au front
            for (var i = 0, tempLength = temp.length; i < tempLength; i++) {
                var tempIndex = temp[i];
                if (!contient(cave, tempIndex)) {
                    front = ajouter(front, tempIndex);
                }
            }
        } while(++index < caveLength);
        //choisir cellule à ajouter à la cavité
        nord = front[Math.floor(Math.random() * front.length)];//choix d'une cellule du front
        front = retirer(front, nord);
        cave.push(nord);
        //trouver les voisins de cette cellule nouvellement ajoutée
        var choixVoisin = voisins(nord % nx, Math.floor(nord / nx), nx, ny);
        //Passer au travers des voisin
        for (var i = 0, choixLength = choixVoisin.length; i < choixLength; i++) {
            var chxVoisin = choixVoisin[i];
            //Si la cellule voisine fait partie de la cave, retiré le mur qui les sépare
            if (contient(cave, chxVoisin)) {
                sud = nord + nx;
            	ouest = nord + Math.floor(nord / nx);
            	est = ouest + 1;
                var diff = nord - chxVoisin;
                // Choix du mur à retirer
                switch(diff){
                    case -1: 
                        mursV = retirer(mursV, est);
                        break;
                    case 1:
                        mursV = retirer(mursV, ouest);
                        break;
                    case -nx:
                        mursH = retirer(mursH, sud);
                        break;
                    case nx:
                        mursH = retirer(mursH, nord);
                        break;
                }
                break;
            }
        }
    }

    //DESSIN DU LABYRINTHE
    
    //positionne la tortue dans le coin supérieur gauche de la grille
    cs(); pu(); fd(90); lt(90); fd(170); rt(180); pd(); 
    
    //dessine les murs horizontaux
    for (var i = 0; i < ny + 1; i++) {
        for (j = 0; j < nx; j++) {
            if (!contient(mursH, i * nx  + j)) {
                pu(); fd(pas); pd();
            }
            else
                fd(pas);
        }
        pu(); bk(pas * nx); rt(90); fd(pas); lt(90); pd();
    }
    
    //positionne la tortue dans le coin supérieur gauche de la grille
    pu(); rt(90); bk(pas * (ny + 1)); pd();
    
    //dessine les murs verticaux
    for (var i = 0; i < nx + 1; i++) {
        for (j = 0; j < ny; j++) {
            if (!contient(mursV, j * (nx + 1) + i)) {
                pu(); fd(pas); pd();
            }
            else
                fd(pas);
        }
        pu(); bk(pas * ny); lt(90); fd(pas); rt(90); pd();
    }
}

laby(8, 4, 10);

function testIota(){
    assert(iota(5)== "0,1,2,3,4"); 
    assert(iota(0)=="");
}
testIota();

function testContient(){
    assert(contient ([9, 2, 5], 2)== true); 
    assert(contient ([9, 2, 5], 4)== false);
};
testContient();

function testAjouter(){
    assert(ajouter ([9, 2, 5], 2)== "9,2,5"); 
    assert(ajouter ([9, 2, 5], 4)== "9,2,5,4");
};
testAjouter();

function testRetirer(){
    assert(retirer ([9, 2, 5], 2)== "9,5"); 
    assert(retirer ([9, 2, 5], 4)== "9,2,5");
};
testRetirer();

function testVoisins(){
    assert(voisins ((7,2,8,4)== "15,22,31")); 
    assert(voisins ((6,1,32,16)== "6,37,70,39"));
};
testVoisins();

