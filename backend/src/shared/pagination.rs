pub struct CursorPaginationRequest<C,S> {
    pub cursor: C,
    pub size: S,
}

pub struct CursorPaginationResponse<Item, NextCursor, Total> {
    pub next_cursor: Option<NextCursor>,
    pub items: Vec<Item>,
    pub total: Option<Total>,
}