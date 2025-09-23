export const postInclude = {
    categories: {
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    },
    user: {
      select: {
        id: true,
        username: true,
        profilePicture: true,
      },
    },
    _count: {
      select: {
        comments: true,
        likes: true,
      },
    },
  };
  
export const postOrderBy = { createdAt: "desc" as const };
  