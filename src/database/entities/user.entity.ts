import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  _id!: number;

  @Property()
  tag!: string;
  constructor(id: number, tag: string) {
    this._id = id;
    this.tag = tag;
  }
}
