use sea_orm::{DbBackend, EnumIter, Iterable};
use sea_orm_migration::{prelude::*, schema::*};


use sea_orm_migration::prelude::extension::postgres::Type;

#[derive(DeriveMigrationName)]
pub struct Migration;


#[derive(DeriveIden)]
struct VisibleStatus;


#[derive(DeriveIden, EnumIter)]
enum VisibleStatusVariants {
    Show,
    Hidden,
}


#[derive(DeriveIden)]
struct ProposalStatus;


#[derive(DeriveIden, EnumIter)]
enum ProposalStatusVariants {
    Active,
    Expired,
    Passed,
    Rejected,
}



#[derive(DeriveIden)]
enum Account {
    Table,
    Id,
    Money,
    LockedMoney,
    CreatedAt,
    UpdatedAt,
    RemovedAt,
}

#[derive(DeriveIden)]
enum Profile {
    Table,
    Id,
    AccountId,
    Name,
    Bio,
    Avatar,
    CreatedAt,
    UpdatedAt,
    RemovedAt,
}

#[derive(DeriveIden)]
enum Identity {
    Table,
    Id,
    AccountId,
    IdentType,
    IdentValue,
    IdentVerified,
}

#[derive(DeriveIden)]
enum Cert {
    Table,
    Id,
    AccountId,
    CertType,
    CertValue,
}

#[derive(DeriveIden)]
enum Post {
    Table,
    Id,
    AuthorId,
    Title,
    CreatedAt,
    UpdatedAt,
    Status,
}

#[derive(DeriveIden)]
enum Tag {
    Table,
    Id,
    Name,
    CreatedAt,
}

#[derive(DeriveIden)]
enum PostTag {
    Table,
    PostId,
    TagId,
}

#[derive(DeriveIden)]
enum Thread {
    Table,
    Id,
    AuthorId,
    Content,
    Active,
    PostId,
    CreatedAt,
    UpdatedAt,
    Status,
    RemovedAt,
}

#[derive(DeriveIden)]
enum ThreadComment {
    Table,
    Id,
    AuthorId,
    Content,
    ThreadId,
    CreatedAt,
    UpdatedAt,
    Status,
    RemovedAt,
}

#[derive(DeriveIden)]
enum Proposal {
    Table,
    Id,
    Title,
    Body,
    Command,
    Status,
    AuthorId,
    CreatedAt,
    ExpiredAt,
}

#[derive(DeriveIden)]
enum Token {
    Table,
    Id,
    Pid,
    Inventory,
    CreatedAt,
}

#[derive(DeriveIden)]
enum Vote {
    Table,
    Id,
    ProposalId,
    VoteType,
    AccountId,
    CreatedAt,
}

#[derive(DeriveIden)]
enum ProposalComment {
    Table,
    Id,
    AuthorId,
    Content,
    VoteId,
    CreatedAt,
}

#[derive(DeriveIden)]
enum Ruling {
    Table,
    Id,
    ProposalId,
    ArbitratorId,
    Decision,
    Reasoning,
    CreatedAt,
}

#[derive(DeriveIden)]
enum Dictator {
    Table,
    Id,
    AccountId,
    TermStart,
    TermEnd,
    IsActive,
}

#[derive(DeriveIden)]
enum ShopItem {
    Table,
    Id,
    Name,
    Price,
    ItemType,
}

#[derive(DeriveIden)]
enum UserInventory {
    Table,
    AccountId,
    ItemId,
    AcquiredAt,
    ExpiredAt,
}

#[derive(DeriveIden)]
enum Badge {
    Table,
    Id,
    Name,
    Description,
    IconUrl,
    RequiredPoints,
}

#[derive(DeriveIden)]
enum UserBadge {
    Table,
    AccountId,
    BadgeId,
    GrantedAt,
    ExpiresAt,
}



#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        
        if manager.get_database_backend() == DbBackend::Postgres {
            manager
                .create_type(
                    Type::create()
                        .as_enum(VisibleStatus)
                        .values(VisibleStatusVariants::iter())
                        .to_owned(),
                )
                .await?;

            manager
                .create_type(
                    Type::create()
                        .as_enum(ProposalStatus)
                        .values(ProposalStatusVariants::iter())
                        .to_owned(),
                )
                .await?;
        }

        
        manager
            .create_table(
                Table::create()
                    .table(Account::Table)
                    .if_not_exists()
                    .col(uuid(Account::Id).default(Expr::cust("gen_random_uuid()")))
                    .col(big_integer(Account::Money).default(0i64))
                    .col(big_integer(Account::LockedMoney).default(0i64))
                    .col(
                        timestamp_with_time_zone(Account::CreatedAt)
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        timestamp_with_time_zone(Account::UpdatedAt)
                            .default(Expr::cust("now()")),
                    )
                    .col(timestamp_with_time_zone_null(Account::RemovedAt))
                    .primary_key(Index::create().col(Account::Id))
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(Profile::Table)
                    .if_not_exists()
                    .col(uuid(Profile::Id).default(Expr::cust("gen_random_uuid()")))
                    .col(uuid(Profile::AccountId))
                    .col(text(Profile::Name))
                    .col(text_null(Profile::Bio))
                    .col(text_null(Profile::Avatar))
                    .col(
                        timestamp_with_time_zone(Profile::CreatedAt)
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        timestamp_with_time_zone(Profile::UpdatedAt)
                            .default(Expr::cust("now()")),
                    )
                    .col(timestamp_with_time_zone_null(Profile::RemovedAt))
                    .primary_key(Index::create().col(Profile::Id))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_profile_account")
                            .from(Profile::Table, Profile::AccountId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_index(
                Index::create()
                    .name("uq_profile_account_id")
                    .table(Profile::Table)
                    .col(Profile::AccountId)
                    .unique()
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(Identity::Table)
                    .if_not_exists()
                    .col(uuid(Identity::Id).default(Expr::cust("gen_random_uuid()")))
                    .col(uuid(Identity::AccountId))
                    .col(text(Identity::IdentType))
                    .col(text(Identity::IdentValue))
                    .col(boolean(Identity::IdentVerified).default(false))
                    .primary_key(Index::create().col(Identity::Id))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_identity_account")
                            .from(Identity::Table, Identity::AccountId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_identity_account_type_value")
                    .table(Identity::Table)
                    .col(Identity::AccountId)
                    .col(Identity::IdentType)
                    .col(Identity::IdentValue)
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(Cert::Table)
                    .if_not_exists()
                    .col(uuid(Cert::Id).default(Expr::cust("gen_random_uuid()")))
                    .col(uuid(Cert::AccountId))
                    .col(text(Cert::CertType))
                    .col(text(Cert::CertValue))
                    .primary_key(Index::create().col(Cert::Id))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_cert_account")
                            .from(Cert::Table, Cert::AccountId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_cert_account_type_value")
                    .table(Cert::Table)
                    .col(Cert::AccountId)
                    .col(Cert::CertType)
                    .col(Cert::CertValue)
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(Post::Table)
                    .if_not_exists()
                    .col(uuid(Post::Id).default(Expr::cust("gen_random_uuid()")))
                    .col(uuid(Post::AuthorId))
                    .col(text(Post::Title))
                    .col(
                        timestamp_with_time_zone(Post::CreatedAt)
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        timestamp_with_time_zone(Post::UpdatedAt)
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        
                        ColumnDef::new(Post::Status)
                            .enumeration(
                                VisibleStatus,
                                VisibleStatusVariants::iter(),
                            )
                            .not_null()
                            .default("Show"),
                    )
                    .primary_key(Index::create().col(Post::Id))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_post_account")
                            .from(Post::Table, Post::AuthorId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_post_author_id")
                    .table(Post::Table)
                    .col(Post::AuthorId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_post_created_at")
                    .table(Post::Table)
                    .col(Post::CreatedAt)
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(Tag::Table)
                    .if_not_exists()
                    .col(uuid(Tag::Id).default(Expr::cust("gen_random_uuid()")))
                    .col(text(Tag::Name))
                    .col(
                        timestamp_with_time_zone(Tag::CreatedAt)
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .primary_key(Index::create().col(Tag::Id))
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("uq_tag_name")
                    .table(Tag::Table)
                    .col(Tag::Name)
                    .unique()
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(PostTag::Table)
                    .if_not_exists()
                    .col(uuid(PostTag::PostId))
                    .col(uuid(PostTag::TagId))
                    .primary_key(
                        Index::create()
                            .col(PostTag::PostId)
                            .col(PostTag::TagId),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_posttag_post")
                            .from(PostTag::Table, PostTag::PostId)
                            .to(Post::Table, Post::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_posttag_tag")
                            .from(PostTag::Table, PostTag::TagId)
                            .to(Tag::Table, Tag::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(Thread::Table)
                    .if_not_exists()
                    .col(uuid(Thread::Id))
                    .col(uuid(Thread::AuthorId))
                    .col(text(Thread::Content))
                    .col(boolean_null(Thread::Active))
                    .col(uuid(Thread::PostId))
                    .col(
                        timestamp_with_time_zone(Thread::CreatedAt)
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        timestamp_with_time_zone(Thread::UpdatedAt)
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        ColumnDef::new(Thread::Status)
                            .enumeration(VisibleStatus, VisibleStatusVariants::iter())
                            .not_null()
                            .default("Show"),
                    )
                    .col(timestamp_with_time_zone_null(Thread::RemovedAt))
                    .primary_key(Index::create().col(Thread::Id))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_thread_account")
                            .from(Thread::Table, Thread::AuthorId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_thread_post")
                            .from(Thread::Table, Thread::PostId)
                            .to(Post::Table, Post::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(ThreadComment::Table)
                    .if_not_exists()
                    .col(uuid(ThreadComment::Id))
                    .col(uuid(ThreadComment::AuthorId))
                    .col(text(ThreadComment::Content))
                    .col(uuid(ThreadComment::ThreadId))
                    .col(
                        timestamp_with_time_zone(ThreadComment::CreatedAt)
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        timestamp_with_time_zone(ThreadComment::UpdatedAt)
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        ColumnDef::new(ThreadComment::Status)
                            .enumeration(VisibleStatus, VisibleStatusVariants::iter())
                            .not_null()
                            .default("Show"),
                    )
                    .col(timestamp_with_time_zone_null(ThreadComment::RemovedAt))
                    .primary_key(Index::create().col(ThreadComment::Id))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_thread_comment_account")
                            .from(ThreadComment::Table, ThreadComment::AuthorId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_thread_comment_thread")
                            .from(ThreadComment::Table, ThreadComment::ThreadId)
                            .to(Thread::Table, Thread::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(Proposal::Table)
                    .if_not_exists()
                    .col(uuid(Proposal::Id))
                    .col(text_null(Proposal::Title))
                    .col(text_null(Proposal::Body))
                    .col(json_binary_null(Proposal::Command))
                    .col(
                        ColumnDef::new(Proposal::Status)
                            .enumeration(ProposalStatus, ProposalStatusVariants::iter())
                            .not_null()
                            .default("Active"),
                    )
                    .col(uuid(Proposal::AuthorId))
                    .col(
                        timestamp_with_time_zone(Proposal::CreatedAt)
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(timestamp_with_time_zone(Proposal::ExpiredAt).not_null())
                    .primary_key(Index::create().col(Proposal::Id))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_proposal_account")
                            .from(Proposal::Table, Proposal::AuthorId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_proposal_author_id")
                    .table(Proposal::Table)
                    .col(Proposal::AuthorId)
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(Token::Table)
                    .if_not_exists()
                    .col(uuid(Token::Id))
                    .col(uuid(Token::Pid))
                    .col(big_integer(Token::Inventory))
                    .col(
                        timestamp_with_time_zone(Token::CreatedAt)
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .primary_key(Index::create().col(Token::Id))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_token_proposal")
                            .from(Token::Table, Token::Pid)
                            .to(Proposal::Table, Proposal::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_index(
                Index::create()
                    .name("uq_token_pid")
                    .table(Token::Table)
                    .col(Token::Pid)
                    .unique()
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(Vote::Table)
                    .if_not_exists()
                    .col(uuid(Vote::Id))
                    .col(uuid(Vote::ProposalId))
                    .col(text(Vote::VoteType))
                    .col(uuid(Vote::AccountId))
                    .col(
                        timestamp_with_time_zone(Vote::CreatedAt)
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .primary_key(Index::create().col(Vote::Id))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_vote_proposal")
                            .from(Vote::Table, Vote::ProposalId)
                            .to(Proposal::Table, Proposal::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_vote_account")
                            .from(Vote::Table, Vote::AccountId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("uq_vote_time_account_proposal")
                    .table(Vote::Table)
                    .col(Vote::CreatedAt)
                    .col(Vote::AccountId)
                    .col(Vote::ProposalId)
                    .unique()
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(ProposalComment::Table)
                    .if_not_exists()
                    .col(uuid(ProposalComment::Id))
                    .col(uuid(ProposalComment::AuthorId))
                    .col(text_null(ProposalComment::Content))
                    .col(uuid_null(ProposalComment::VoteId))
                    .col(
                        timestamp_with_time_zone(ProposalComment::CreatedAt)
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .primary_key(Index::create().col(ProposalComment::Id))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_proposal_comment_account")
                            .from(ProposalComment::Table, ProposalComment::AuthorId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_proposal_comment_vote")
                            .from(ProposalComment::Table, ProposalComment::VoteId)
                            .to(Vote::Table, Vote::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(Ruling::Table)
                    .if_not_exists()
                    .col(uuid(Ruling::Id))
                    .col(uuid(Ruling::ProposalId))
                    .col(uuid(Ruling::ArbitratorId))
                    .col(text(Ruling::Decision))
                    .col(text(Ruling::Reasoning))
                    .col(
                        timestamp_with_time_zone_null(Ruling::CreatedAt)
                            .default(Expr::cust("now()")),
                    )
                    .primary_key(Index::create().col(Ruling::Id))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_ruling_proposal")
                            .from(Ruling::Table, Ruling::ProposalId)
                            .to(Proposal::Table, Proposal::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_ruling_account")
                            .from(Ruling::Table, Ruling::ArbitratorId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(Dictator::Table)
                    .if_not_exists()
                    .col(uuid(Dictator::Id))
                    .col(uuid_null(Dictator::AccountId))
                    .col(timestamp_with_time_zone_null(Dictator::TermStart))
                    .col(timestamp_with_time_zone_null(Dictator::TermEnd))
                    .col(boolean_null(Dictator::IsActive))
                    .primary_key(Index::create().col(Dictator::Id))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_dictator_account")
                            .from(Dictator::Table, Dictator::AccountId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_dictator_account_id")
                    .table(Dictator::Table)
                    .col(Dictator::AccountId)
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(ShopItem::Table)
                    .if_not_exists()
                    .col(uuid(ShopItem::Id))
                    .col(text_null(ShopItem::Name))
                    .col(big_integer_null(ShopItem::Price))
                    .col(text_null(ShopItem::ItemType))
                    .primary_key(Index::create().col(ShopItem::Id))
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(UserInventory::Table)
                    .if_not_exists()
                    .col(uuid(UserInventory::AccountId))
                    .col(uuid(UserInventory::ItemId))
                    .col(
                        timestamp_with_time_zone(UserInventory::AcquiredAt)
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(timestamp_with_time_zone_null(UserInventory::ExpiredAt))
                    .primary_key(
                        Index::create()
                            .col(UserInventory::AccountId)
                            .col(UserInventory::ItemId),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_user_inventory_account")
                            .from(UserInventory::Table, UserInventory::AccountId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_user_inventory_item")
                            .from(UserInventory::Table, UserInventory::ItemId)
                            .to(ShopItem::Table, ShopItem::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_user_inventory_account_id")
                    .table(UserInventory::Table)
                    .col(UserInventory::AccountId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_user_inventory_item_id")
                    .table(UserInventory::Table)
                    .col(UserInventory::ItemId)
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(Badge::Table)
                    .if_not_exists()
                    .col(uuid(Badge::Id))
                    .col(text(Badge::Name))
                    .col(text_null(Badge::Description))
                    .col(text_null(Badge::IconUrl))
                    .col(big_integer_null(Badge::RequiredPoints))
                    .primary_key(Index::create().col(Badge::Id))
                    .to_owned(),
            )
            .await?;

        
        manager
            .create_table(
                Table::create()
                    .table(UserBadge::Table)
                    .if_not_exists()
                    .col(uuid(UserBadge::AccountId))
                    .col(uuid(UserBadge::BadgeId))
                    .col(timestamp_with_time_zone_null(UserBadge::GrantedAt))
                    .col(timestamp_with_time_zone_null(UserBadge::ExpiresAt))
                    .primary_key(
                        Index::create()
                            .col(UserBadge::AccountId)
                            .col(UserBadge::BadgeId),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_user_badge_account")
                            .from(UserBadge::Table, UserBadge::AccountId)
                            .to(Account::Table, Account::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_user_badge_badge")
                            .from(UserBadge::Table, UserBadge::BadgeId)
                            .to(Badge::Table, Badge::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        
        for table in [
            UserBadge::Table.into_iden(),
            Badge::Table.into_iden(),
            UserInventory::Table.into_iden(),
            ShopItem::Table.into_iden(),
            Dictator::Table.into_iden(),
            Ruling::Table.into_iden(),
            ProposalComment::Table.into_iden(),
            Vote::Table.into_iden(),
            Token::Table.into_iden(),
            Proposal::Table.into_iden(),
            ThreadComment::Table.into_iden(),
            Thread::Table.into_iden(),
            PostTag::Table.into_iden(),
            Tag::Table.into_iden(),
            Post::Table.into_iden(),
            Cert::Table.into_iden(),
            Identity::Table.into_iden(),
            Profile::Table.into_iden(),
            Account::Table.into_iden(),
        ] {
            manager
                .drop_table(Table::drop().table(table).to_owned())
                .await?;
        }

        if manager.get_database_backend() == DbBackend::Postgres {
            manager
                .drop_type(
                    Type::drop()
                        .if_exists()
                        .name(VisibleStatus)
                        .to_owned(),
                )
                .await?;

            manager
                .drop_type(
                    Type::drop()
                        .if_exists()
                        .name(ProposalStatus)
                        .to_owned(),
                )
                .await?;
        }

        Ok(())
    }
}