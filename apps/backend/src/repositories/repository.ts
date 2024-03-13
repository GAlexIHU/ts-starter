export interface GettableRepository<TEntity, TID = string> {
  get(id: TID): Promise<TEntity | null>;
}
