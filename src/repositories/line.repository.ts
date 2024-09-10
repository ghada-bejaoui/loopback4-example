import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDsDataSource} from '../datasources';
import {Line, LineRelations} from '../models';

export class LineRepository extends DefaultCrudRepository<
  Line,
  typeof Line.prototype.id,
  LineRelations
> {
  constructor(
    @inject('datasources.mongo_ds') dataSource: MongoDsDataSource,
  ) {
    super(Line, dataSource);
  }
}
