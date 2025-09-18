export const postInclude = {
    categories: {
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    },
    user: {
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
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
  