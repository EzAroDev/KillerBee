# 🐝 KillerBee – Application de Gestion des Procédés de Fabrication

## 🎯 Objectif

L'application KillerBee vise à informatiser et sécuriser les procédés de fabrication des produits **FreezBee** de l’entreprise. Elle permet :

- La **gestion centralisée** des modèles, ingrédients et procédés de fabrication.
- La **sécurisation** des échanges via un chiffrement personnalisé (transposition + substitutions).
- Une **authentification LDAP (Active Directory)**.
- Le respect d’une **architecture logicielle hybride SOA / microservices**.
- L'intégration avec une base de données **Microsoft SQL Server** conforme aux bonnes pratiques de sécurité.

---

## 🧱 Architecture

### ▶️ Frontend

- Framework : **Next.js**
- Authentification via **context + JWT**
- Gestion des rôles : R&D, TEST, PROD, DSI
- UI moderne avec **Tailwind CSS** et **shadcn/ui**

### 🔧 Backend

- Framework : **NestJS**
- Sécurité : JWT access + refresh, chiffrement personnalisé, contrôle des rôles
- Connexion Active Directory via LDAP
- Base de données : **SQL Server** avec schémas (`SCH_RD`, `SCH_TEST`, `SCH_PROD`)
- API RESTful modulaire

---

## ⚙️ Installation & Lancement

### 1. Prérequis

- Node.js ≥ 18.x
- pnpm (ou npm / yarn)
- SQL Server opérationnel (local ou distant)
- Active Directory configuré
- Docker (optionnel pour local dev)

---

### 2. Cloner le projet

```bash
git clone https://github.com/ton-utilisateur/killerbee-app.git
cd killerbee-app
```
