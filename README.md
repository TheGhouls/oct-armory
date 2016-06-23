Oct Armory Install instruction
==============================

Un peu de lecture sur les bonnes pratiques de Meteor

https://blog.tableflip.io/large-meteor-projects-best-practices/

http://guide.meteor.com/

https://kadira.io/academy/meteor-routing-guide/


Le projet est realisé avec meteor, pour l'utiliser vous devez
----------------------------------------------

Avoir un environnement node à jour.


Avoir installé **meteor**


`curl https://install.meteor.com/ | sh`



Cloner le repo.


et **faire un npm install via Meteor**
`meteor npm install`


Aller au dossier `oct-armory/`.


Lancer la commande `meteor`.

Pour faire tourner meteor ZMQ il faut 
-------------------------------------

Avoir installé la [lib ZMQ](http://zeromq.org/intro:get-the-software) sur votre system

Faire encore un `meteor npm install` apres l'installation de la lib ZMQ

Faire tourner le docker OCT test
--------------------------------

Installer Docker sur votre system

Si vous ete sur Mac avec Docker tool il faut connaitre l'ip de votre vm Docker

Ouvrer un terminal et taper `docker-machine start default` puis `docker-machine ip default` pour avoir l'ip de la VM

Pour telecharger et/ou demarer le docker OCT taper dans un terminal

`docker run -p ip-vm-docker-machine:5002:5002 -t -i -d karec/oct /usr/bin/supervisord --nodaemon`


