import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ProdService } from './prod.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles('PROD', 'USER')
@ApiBearerAuth()
@Controller('prod')
export class ProdController {
  constructor(private readonly prodService: ProdService) {}

  @Post('mettre-en-production/:idProc')
  mettreEnProduction(@Param('idProc') id: number) {
    return this.prodService.mettreEnProduction(id);
  }

  @Get('modele')
  getAllModeles() {
    return this.prodService.getAllModeles();
  }

  @Get('modele/:id')
  getModeleById(@Param('id') id: number) {
    return this.prodService.getModeleById(id);
  }

  @Get('modele/:id/procedes')
  getProcedesByModele(@Param('id') id: number) {
    return this.prodService.getProcedesByModele(id);
  }

  @Get('procede')
  getAllProcedes() {
    return this.prodService.getAllProcedes();
  }

  @Get('procede/:id')
  findOneProcede(@Param('id') id: number) {
    return this.prodService.findOneProcede(id);
  }

  @Get('procede/:id/etapes')
  getEtapesByProcede(@Param('id') id: number) {
    return this.prodService.getEtapesByProcede(id);
  }

  @Get('ingredient')
  getAllIngredients() {
    return this.prodService.listIngredients();
  }

  @Get('procede/:idProc/ingredient')
  getIngredientsForProcede(@Param('idProc') idProc: number) {
    return this.prodService.getIngredientsForProcede(idProc);
  }
}
