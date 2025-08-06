import sql from "./db";

export function orderByClause(sortValue) {
  const SORT_OPTIONS = {
    latest: sql`ORDER BY p.created_at DESC`,
    rating: sql`ORDER BY r.avg_rating IS NULL, r.avg_rating DESC`,
    "price-high-to-low": sql`ORDER BY p.price DESC`,
    "price-low-to-high": sql`ORDER BY p.price ASC`,
    default: sql``,
  };

  const sortKey = sortValue in SORT_OPTIONS ? sortValue : "default";
  const sortClause = SORT_OPTIONS[sortKey];

  return sortClause;
}

export function filterByClause(userId, filterValue, searchTerm) {
  let filterClause = sql`WHERE o.user_id = ${userId}`;

  if (filterValue !== "all" && !searchTerm) {
    filterClause = sql`WHERE o.user_id = ${userId} AND o.status = ${filterValue} `;
  } else if (filterValue !== "all" && searchTerm) {
    filterClause = sql`
  WHERE o.user_id = ${userId}
    AND o.status = ${filterValue}
    AND (
      title ILIKE ${"%" + searchTerm + "%"}
      OR CAST(o.id AS TEXT) = ${searchTerm}
    )
`;
  } else if (filterValue == "all" && searchTerm) {
    filterClause = sql`WHERE o.user_id = ${userId} AND (
    title ILIKE ${"%" + searchTerm + "%"} 
    OR CAST(o.id AS TEXT) = ${searchTerm})`;
  }

  return filterClause;
}

export function filterByClauseAdmin(filterValue, searchTerm) {
  let filterClause = sql``;

  if (filterValue !== "all" && !searchTerm) {
    filterClause = sql`WHERE o.status = ${filterValue} `;
  } else if (filterValue !== "all" && searchTerm) {
    filterClause = sql`
  WHERE o.status = ${filterValue}
    AND (
      title ILIKE ${"%" + searchTerm + "%"}
      OR CAST(o.id AS TEXT) = ${searchTerm}
    )
`;
  } else if (filterValue == "all" && searchTerm) {
    filterClause = sql`WHERE (
    title ILIKE ${"%" + searchTerm + "%"} 
    OR CAST(o.id AS TEXT) = ${searchTerm})`;
  }

  return filterClause;
}
