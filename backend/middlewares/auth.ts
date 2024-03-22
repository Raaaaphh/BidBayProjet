import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../consts/secret'
import {Request, Response, NextFunction} from "express";
import {Token} from "../types/types";

const authMiddleware = (req: Request & {user?: Token}, res: Response, next: NextFunction) => {
  // Récupération du token d'authentification depuis le header Authorization
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  // Si le token n'est pas présent ou n'est pas valide, renvoie une erreur 401 Unauthorized
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', details: 'Missing token' })
  }

  // Vérification et décryptage du token
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized', details: 'Invalid token' })
    }

    // Ajout des informations du token décodé à l'objet de requête pour être utilisées par les routes suivantes
    req.user = decodedToken as Token
    next()
  })
}

export default authMiddleware
