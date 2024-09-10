import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDsDataSource} from '../datasources';
import {History, HistoryRelations} from '../models';

export class HistoryRepository extends DefaultCrudRepository<
  History,
  typeof History.prototype.id,
  HistoryRelations
> {
  constructor(
    @inject('datasources.mongo_ds') dataSource: MongoDsDataSource,
  ) {
    super(History, dataSource);
  }
}
