const VIEWED_STORIES_KEY = "viewedStoryIds"

export function markStoryAsViewed(storyId: string) {
  if (!storyId || typeof window === "undefined") {
    return
  }

  try {
    const raw = window.localStorage.getItem(VIEWED_STORIES_KEY)
    const viewed: string[] = raw ? JSON.parse(raw) : []

    if (!viewed.includes(storyId)) {
      const updated = [...viewed, storyId]
      window.localStorage.setItem(VIEWED_STORIES_KEY, JSON.stringify(updated))
    }
  } catch (error) {
    console.warn("Unable to update viewed stories", error)
  }
}

