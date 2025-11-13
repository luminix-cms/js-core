import { BuilderInterface as Builder } from '../../types/Builder';
import { Model, ModelPaginatedResponse } from '../../types/Model';

import BelongsToMany from './BelongsToMany';


type BuilderInterface = Builder<Model, ModelPaginatedResponse>;

export default class MorphToMany extends BelongsToMany
{

    query(): BuilderInterface {
        const query = super.query();

        // const relationName = this.guessInverseRelation();
        // const relation = this.getRelated().getSchema().relations
        const morphId = `${this.meta.morphType?.slice(0, -5)}_id`;

        query.where(morphId, this.parent.getKey());
        query.where(this.meta.morphType!, this.parent.getType());
        query.lock(`where.${morphId}`);
        query.lock(`where.${this.meta.morphType}`);

        return query;
    }

}


