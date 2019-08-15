use diesel::{
    pg::PgConnection,
    r2d2::{ConnectionManager, Pool, PoolError, PooledConnection},
};

#[derive(Clone)]
pub struct PgPool(Pool<ConnectionManager<PgConnection>>);

impl PgPool {
    pub fn new(database_url: &str) -> Result<Self, PoolError> {
        Pool::builder()
            .build(ConnectionManager::<PgConnection>::new(database_url))
            .map(PgPool)
    }

    pub fn get_conn(&self) -> Result<PooledConnection<ConnectionManager<PgConnection>>, PoolError> {
        self.0.get()
    }
}
