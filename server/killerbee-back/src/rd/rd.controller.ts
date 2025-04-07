import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AddIngredientToProcedeDto } from './dto/add-ingredient-to-procede.dto';
import { CreateEtapeDto } from './dto/create-etape.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { CreateModeleDto } from './dto/create-modele.dto';
import { CreateProcedeDto } from './dto/create-procede.dto';
import { UpdateEtapeDto } from './dto/update-etape.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { UpdateModeleDto } from './dto/update-modele.dto';
import { UpdateProcedeDto } from './dto/update-procede.dto';
import { UpdateValidationDto } from './dto/update-validation.dto';
import { RdService } from './rd.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles('RD')
@Controller('rd')
export class RdController {
  constructor(private readonly rdService: RdService) {}

  @Post('modele')
  createModele(@Body() dto: CreateModeleDto) {
    return this.rdService.createModele(dto);
  }
  @Roles('TEST', 'RD', 'PROD')
  @Get('modele')
  findAllModeles() {
    return this.rdService.findAllModeles();
  }

  @Roles('TEST', 'RD')
  @Get('modele/:id')
  findOneModele(@Param('id') id: number) {
    return this.rdService.findOneModele(id);
  }

  @Put('modele/:id')
  updateModele(@Param('id') id: number, @Body() dto: UpdateModeleDto) {
    return this.rdService.updateModele(id, dto);
  }

  @Delete('modele/:id')
  async deleteModele(@Param('id', ParseIntPipe) id: number) {
    return this.rdService.deleteModele(id);
  }

  @Post('procede')
  createProcede(@Body() dto: CreateProcedeDto) {
    return this.rdService.createProcede(dto);
  }

  @Roles('TEST', 'RD')
  @Get('procede')
  findAllProcedes() {
    return this.rdService.findAllProcedes();
  }

  @Roles('TEST', 'RD', 'PROD')
  @Get('procede/:id')
  findOneProcede(@Param('id') id: number) {
    return this.rdService.findOneProcede(id);
  }

  @Put('procede/:idProc')
  async updateProcede(
    @Param('idProc', ParseIntPipe) idProc: number,
    @Body() dto: UpdateProcedeDto,
  ) {
    return this.rdService.updateProcede(idProc, dto);
  }

  @Delete('procede/:idProc')
  async deleteProcede(@Param('idProc', ParseIntPipe) idProc: number) {
    return this.rdService.deleteProcede(idProc);
  }

  @Post('procede/:id/etapes')
  addEtape(@Param('id') idProc: number, @Body() dto: CreateEtapeDto) {
    return this.rdService.addEtapeToProcede(idProc, dto);
  }

  @Roles('TEST', 'RD', 'PROD')
  @Get('procede/:id/etapes')
  getEtapes(@Param('id') idProc: number) {
    return this.rdService.getEtapesByProcede(idProc);
  }

  @Put('etape/:id')
  async updateEtape(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEtapeDto,
  ) {
    return this.rdService.updateEtape(id, dto);
  }

  @Delete('procede/:id/etapes')
  async deleteEtapes(@Param('id', ParseIntPipe) id: number) {
    return this.rdService.deleteEtapesByProcede(id);
  }

  // @Put('etape/:id')
  // updateEtape(@Param('id') id: number, @Body() dto: Partial<CreateEtapeDto>) {
  //   return this.rdService.updateEtape(id, dto);
  // }

  // @Delete('etape/:id')
  // deleteEtape(@Param('id') id: number) {
  //   return this.rdService.deleteEtape(id);
  // }

  @Patch('procede/:idProc/valider')
  @Roles('TEST')
  async updateValidation(
    @Param('idProc', ParseIntPipe) idProc: number,
    @Body() body: UpdateValidationDto,
  ) {
    return this.rdService.validerProcede(idProc, body.ValidationTest);
  }

  @Roles('PROD')
  @Get('/valides')
  async getValidatedProcedes() {
    const result = await this.rdService.getValidatedProcedes();
    return result;
  }

  @Post('ingredient')
  createIngredient(@Body() dto: CreateIngredientDto) {
    return this.rdService.createIngredient(dto);
  }

  @Roles('TEST', 'RD', 'PROD')
  @Get('ingredient')
  getAllIngredients() {
    return this.rdService.listIngredients();
  }

  @Get('ingredient/:id')
  findOneIngredient(@Param('id') id: number) {
    return this.rdService.findOneIngredient(id);
  }

  @Put('ingredient/:id')
  async updateIngredient(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIngredientDto,
  ) {
    return this.rdService.updateIngredient(id, dto);
  }

  @Delete('ingredient/:id')
  async deleteIngredient(@Param('id', ParseIntPipe) id: number) {
    return this.rdService.deleteIngredient(id);
  }

  @Post('procede/:idProc/ingredient')
  addIngredientToProcede(
    @Param('idProc') idProc: number,
    @Body() dto: AddIngredientToProcedeDto,
  ) {
    return this.rdService.addIngredientToProcede(idProc, dto);
  }

  @Roles('TEST', 'RD', 'PROD')
  @Get('procede/:idProc/ingredient')
  getIngredientsForProcede(@Param('idProc') idProc: number) {
    return this.rdService.getIngredientsForProcede(idProc);
  }

  @Delete('procede/:idProc/ingredient/:idIngredient')
  removeIngredientFromProcede(
    @Param('idProc') idProc: number,
    @Param('idIngredient') idIngredient: number,
  ) {
    return this.rdService.removeIngredientFromProcede(idProc, idIngredient);
  }
}
