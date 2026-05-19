export const getPaginationOptions = (pageQuery = 1, limitQuery = 10) => {
  const page = Math.max(1, parseInt(pageQuery, 10) || 1);
  const limit = Math.max(1, parseInt(limitQuery, 10) || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const getPaginationMetadata = (page, limit, totalItems, extraQueries = "") => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    page,
    limit,
    totalItems,
    totalPages,
    prev: page > 1 ? `?page=${page - 1}&limit=${limit}${extraQueries}` : null,
    next: page < totalPages ? `?page=${page + 1}&limit=${limit}${extraQueries}` : null,
  };
};
