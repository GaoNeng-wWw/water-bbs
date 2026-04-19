use chrono::{DateTime, Utc};
use fred::prelude::{KeysInterface, Pool};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, TransactionTrait
};

use crate::{
    domain::{
        ar::account::{Account, Identity},
        error::repo::RepositoryError,
        repo::account::IAccountRepo,
        vo::{account_id::AccountId, profile::Profile},
    },
    infra::{
        entity::{self, identity::Entity},
        mapper,
    },
    shared::pagination::{CursorPaginationRequest, CursorPaginationResponse},
};

pub struct AccountRepo {
    db: DatabaseConnection,
    redis: Pool,
    cnt_thread: Option<tokio::task::JoinHandle<Result<i64, RepositoryError>>>,
}

impl AccountRepo {
    pub fn new(db: DatabaseConnection, redis: Pool) -> Self {
        Self {
            db,
            redis,
            cnt_thread: None,
        }
    }
}

#[async_trait::async_trait]
impl IAccountRepo for AccountRepo {
    async fn find_account_id_by_ident(
        &self,
        identity: &Identity,
    ) -> Result<Option<AccountId>, RepositoryError> {
        let identity = identity.clone();
        let ident_type = identity.ident_type.clone();
        let ident_value = identity.ident_value.clone();

        let account_id = entity::identity::Entity::find()
            .filter(entity::identity::Column::IdentType.eq(ident_type))
            .filter(entity::identity::Column::IdentValue.eq(ident_value))
            .column(entity::identity::Column::AccountId)            
            .one(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError {
                reason: err.to_string(),
            })?;
        if account_id.is_none() {
            return Ok(None);
        }
        let account_id = account_id.unwrap();
        Ok(Some(AccountId::new(account_id.account_id)))
    }
    async fn get_account(
        &self,
        account_id: &AccountId,
    ) -> Result<Option<Account>, RepositoryError> {
        let account_id = account_id.clone();
        let entity = entity::account::Entity::find_by_id(account_id.clone().into_inner())
            .one(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError {
                reason: err.to_string(),
            })?;
        if entity.is_none() {
            return Ok(None);
        }
        let account_id = account_id.into_inner();
        let identities = entity::identity::Entity::find()
            .filter(entity::identity::Column::AccountId.eq(account_id))
            .all(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError {
                reason: err.to_string(),
            })?
            .iter()
            .map(|model| mapper::identity::to_domain(model))
            .collect::<Vec<_>>();
        let cert = entity::cert::Entity::find()
            .filter(entity::cert::Column::AccountId.eq(account_id))
            .all(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError {
                reason: err.to_string(),
            })?
            .iter()
            .map(|model| mapper::cert::to_domain(model))
            .collect::<Vec<_>>();
        let is_bd = entity::dictator::Entity::find()
            .filter(entity::dictator::Column::AccountId.eq(account_id))
            .filter(entity::dictator::Column::TermEnd.gt(Utc::now())) // 现在过期的不算
            .one(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError {
                reason: err.to_string(),
            })?
            .is_some();
        let profile = entity::profile::Entity::find()
            .filter(entity::profile::Column::AccountId.eq(account_id))
            .one(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError {
                reason: err.to_string(),
            })?;
        let profile = profile.map(|model| mapper::profile::to_domain(&model.clone()));
        let account = Some(mapper::account::to_domain(
            &entity.unwrap(),
            identities,
            cert,
            profile.unwrap(),
            is_bd,
        ));
        Ok(account)
    }
    async fn create_account(&self, account: &Account) -> Result<(), RepositoryError> {
        let entity = mapper::account::to_model(account);
        let id = account.id.as_ref();
        let profile = mapper::profile::to_model(&account.profile, id);
        let identities = account
            .identity
            .iter()
            .map(|model| mapper::identity::to_model(model, *id))
            .collect::<Vec<_>>();
        let cert = account
            .cert
            .iter()
            .map(|model| mapper::cert::to_model(model, *id))
            .collect::<Vec<_>>();

        // 执行事务
        self.db
            .transaction::<_, (), RepositoryError>(|txn| {
                Box::pin(async move {
                    entity
                        .insert(txn)
                        .await
                        .map_err(|e| RepositoryError::DatabaseError {
                            reason: e.to_string(),
                        })?;
                    profile
                        .insert(txn)
                        .await
                        .map_err(|e| RepositoryError::DatabaseError {
                            reason: e.to_string(),
                        })?;

                    if !identities.is_empty() {
                        entity::identity::Entity::insert_many(identities)
                            .exec(txn)
                            .await
                            .map_err(|e| RepositoryError::DatabaseError {
                                reason: e.to_string(),
                            })?;
                    }
                    if !cert.is_empty() {
                        entity::cert::Entity::insert_many(cert)
                            .exec(txn)
                            .await
                            .map_err(|e| RepositoryError::DatabaseError {
                                reason: e.to_string(),
                            })?;
                    }
                    Ok(())
                })
            })
            .await
            .map_err(|e| RepositoryError::DatabaseError {
                reason: e.to_string(),
            })?;
        Ok(())
    }
    async fn incr(&self) -> Result<(), RepositoryError> {
        let _: () =
            self.redis
                .incr("account_count")
                .await
                .map_err(|e| RepositoryError::RedisError {
                    reason: e.to_string(),
                })?;
        Ok(())
    }
    async fn decr(&self) -> Result<(), RepositoryError> {
        let _: () =
            self.redis
                .decr("account_count")
                .await
                .map_err(|e| RepositoryError::RedisError {
                    reason: e.to_string(),
                })?;
        Ok(())
    }
    async fn update_account(&self, account: &Account) -> Result<(), RepositoryError> {
        let entity = mapper::account::to_model(account);
        entity
            .update(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError {
                reason: err.to_string(),
            })?;
        Ok(())
    }
    async fn delete_account(&self, account_id: &AccountId) -> Result<(), RepositoryError> {
        let account_id = account_id.clone();
        let entity = entity::account::Entity::find_by_id(account_id.clone().into_inner())
            .one(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError {
                reason: err.to_string(),
            })?;
        if entity.is_none() {
            return Ok(());
        }
        let mut entity = entity.unwrap();
        entity.removed_at = Some(Utc::now().into());
        entity
            .into_active_model()
            .update(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError {
                reason: err.to_string(),
            })?;
        let _: () =
            self.redis
                .decr("account_count")
                .await
                .map_err(|err| RepositoryError::RedisError {
                    reason: err.to_string(),
                })?;
        Ok(())
    }
    async fn get_all_accounts(
        &mut self,
        pagination: &CursorPaginationRequest<DateTime<Utc>, u64>,
    ) -> Result<CursorPaginationResponse<Account, DateTime<Utc>, u64>, RepositoryError> {
        let pagination = pagination;
        let accounts = entity::account::Entity::find()
            .filter(entity::account::Column::CreatedAt.gt(pagination.cursor))
            .order_by(entity::account::Column::CreatedAt, sea_orm::Order::Desc)
            .limit(pagination.size)
            .all(&self.db)
            .await
            .map_err(|err| RepositoryError::DatabaseError {
                reason: err.to_string(),
            })?
            .iter()
            .map(|model| {
                mapper::account::to_domain(model, Vec::new(), Vec::new(), Profile::default(), false)
            })
            .collect::<Vec<_>>();
        let cursor = accounts
            .last()
            .map(|account| account.created_at);
        let mut data = vec![];
        for mut account in accounts {
            let id = account.id.clone().into_inner();
            let identities = entity::identity::Entity::find()
                .filter(entity::identity::Column::AccountId.eq(id))
                .all(&self.db)
                .await
                .map_err(|err| RepositoryError::DatabaseError {
                    reason: err.to_string(),
                })?
                .iter()
                .map(|model| mapper::identity::to_domain(model))
                .collect::<Vec<_>>();
            let cert = entity::cert::Entity::find()
                .filter(entity::cert::Column::AccountId.eq(id))
                .all(&self.db)
                .await
                .map_err(|err| RepositoryError::DatabaseError {
                    reason: err.to_string(),
                })?
                .iter()
                .map(|model| mapper::cert::to_domain(model))
                .collect::<Vec<_>>();
            let profile = entity::profile::Entity::find()
                .filter(entity::profile::Column::AccountId.eq(id))
                .one(&self.db)
                .await
                .map_err(|err| RepositoryError::DatabaseError {
                    reason: err.to_string(),
                })?;
            let profile = profile.map(|model| mapper::profile::to_domain(&model.clone()));
            let is_bd = entity::dictator::Entity::find()
                .filter(entity::dictator::Column::AccountId.eq(id))
                .filter(entity::dictator::Column::TermEnd.gt(Utc::now()))
                .one(&self.db)
                .await
                .map_err(|err| RepositoryError::DatabaseError {
                    reason: err.to_string(),
                })?
                .is_some();
            account.identity = identities;
            account.cert = cert;
            // profile 总应该存在
            account.profile = profile.unwrap_or(Profile::default());
            account.bd = is_bd;
            data.push(account.clone());
        }

        Ok(CursorPaginationResponse {
            next_cursor: cursor,
            items: data,
            total: None,
        })
    }
    async fn get_account_count(&mut self) -> Result<i64, RepositoryError> {
        let cnt: Option<i64> =
            self.redis
                .get("account_count")
                .await
                .map_err(|err| RepositoryError::RedisError {
                    reason: err.to_string(),
                })?;
        if let Some(cnt) = cnt {
            return Ok(cnt);
        }
        if let Some(thread) = self.cnt_thread.take() {
            if thread.is_finished() {
                self.cnt_thread = None;
                let res = match thread.await {
                    Ok(cnt) => Ok(cnt),
                    Err(err) => return Err(
                        RepositoryError::ThreadError {
                            reason: err.to_string(),
                        }
                    ),
                }?;
                return res;
            } else {
                return Ok(-1);
            }
        };
        let db = self.db.clone();
        let redis = self.redis.clone();
        let handle = tokio::spawn(async move {
            let count = entity::account::Entity::find()
                .filter(entity::account::Column::RemovedAt.is_null())
                .count(&db)
                .await
                .map_err(|err| RepositoryError::DatabaseError {
                    reason: err.to_string(),
                })?;

            let _: () = redis
                .set("account_count", count, Some(fred::types::Expiration::EX(5 * 60)),  None, false)
                .await
                .map_err(|err| RepositoryError::RedisError {
                    reason: err.to_string(),
                })?;

            Ok(count as i64)
        });

        self.cnt_thread = Some(handle);
        Ok(-1)
    }
}
