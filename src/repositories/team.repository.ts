import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDsDataSource} from '../datasources';
import {Team, TeamRelations} from '../models';

export class TeamRepository extends DefaultCrudRepository<
  Team,
  typeof Team.prototype.id,
  TeamRelations
> {
  constructor(
    @inject('datasources.mongo_ds') dataSource: MongoDsDataSource,
  ) {
    super(Team, dataSource);
  }
}
