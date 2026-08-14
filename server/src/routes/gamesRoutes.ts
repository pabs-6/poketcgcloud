import { Router } from 'express';
import * as gamesController from '../controllers/gamesController.js';

const router = Router();

router.get('/catalog', gamesController.getCatalog);
router.get('/pokedex', gamesController.getPokedex);
router.get('/pokemon/:id', gamesController.getPokemon);
router.get('/natures', gamesController.getNatures);
router.get('/teams', gamesController.getTeamsIndex);
router.get('/teams/game/:gameSlug', gamesController.getTeamsByGame);
router.get('/teams/:id', gamesController.getTeam);

export default router;
