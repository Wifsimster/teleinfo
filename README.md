# teleinfo :fr:

## Description

Permet de lire les trames de téléinformation du compteur Linky.

Parse et publie chaque information sur un broker MQTT.

Testé sous Node.js v10.24.1 avec un Raspberri Pi B v2.

Le code est adapté pour les compteurs Linky en triphasé.

## Service

Le fichier `teleinfo.service` est à déplacer dans `/etc/systemd/system/`.

### Démarrer le service

```sh
systemctl start teleinfo.service
```

### Status du service

```sh
systemctl status teleinfo.service
```

### Redémarrer le service

```sh
systemctl restart teleinfo.service
```
