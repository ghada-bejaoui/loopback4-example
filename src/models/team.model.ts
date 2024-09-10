import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Team extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Team>) {
    super(data);
  }
}

export interface TeamRelations {
  // describe navigational properties here
}

export type TeamWithRelations = Team & TeamRelations;
