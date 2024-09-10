import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {History} from '../models';
import {HistoryRepository} from '../repositories';

export class HistoryController {
  constructor(
    @repository(HistoryRepository)
    public historyRepository: HistoryRepository,
  ) { }

  @post('/histories')
  @response(200, {
    description: 'History model instance',
    content: {'application/json': {schema: getModelSchemaRef(History)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(History, {
            title: 'NewHistory',
            exclude: ['id'],
          }),
        },
      },
    })
    history: Omit<History, 'id'>,
  ): Promise<History> {
    return this.historyRepository.create(history);
  }

  @get('/histories/count')
  @response(200, {
    description: 'History model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(History) where?: Where<History>,
  ): Promise<Count> {
    return this.historyRepository.count(where);
  }

  @get('/histories')
  @response(200, {
    description: 'Array of History model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(History, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(History) filter?: Filter<History>,
    @param.query.string('debut') debut?: string,
    @param.query.string('fin') fin?: string
  ): Promise<History[]> {
    const finalFilter: Filter<History> = filter || {};

    // Obtenez toutes les données sans appliquer le filtre de date
    const allHistories = await this.historyRepository.find(finalFilter);

    if (debut && fin) {
      // Conversion des chaînes de caractères en objets Date
      const startDate = new Date(debut.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3')); // yyyy-MM-dd
      const endDate = new Date(fin.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3')); // yyyy-MM-dd

      // Appliquez le filtre de date en mémoire
      return allHistories.filter(history => {
        const historyDate = new Date(history.date.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3'));
        return historyDate >= startDate && historyDate <= endDate;
      });
    }

    // Retournez les données non filtrées si les dates ne sont pas fournies
    return allHistories;
  }

  @patch('/histories')
  @response(200, {
    description: 'History PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(History, {partial: true}),
        },
      },
    })
    history: History,
    @param.where(History) where?: Where<History>,
  ): Promise<Count> {
    return this.historyRepository.updateAll(history, where);
  }

  @get('/histories/{id}')
  @response(200, {
    description: 'History model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(History, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(History, {exclude: 'where'}) filter?: FilterExcludingWhere<History>
  ): Promise<History> {
    return this.historyRepository.findById(id, filter);
  }

  @patch('/histories/{id}')
  @response(204, {
    description: 'History PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(History, {partial: true}),
        },
      },
    })
    history: History,
  ): Promise<void> {
    await this.historyRepository.updateById(id, history);
  }

  @put('/histories/{id}')
  @response(204, {
    description: 'History PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() history: History,
  ): Promise<void> {
    await this.historyRepository.replaceById(id, history);
  }

  @del('/histories/{id}')
  @response(204, {
    description: 'History DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.historyRepository.deleteById(id);
  }
}
