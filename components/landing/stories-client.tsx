import { readFile } from "fs/promises"
import { join } from "path"
import StoryItemClient from "./story-item"

interface Story {
  id: string
  username: string
  clickCount: number
}

interface Post {
  postId: string
  storyId: string
  username: string
  image: string
  bgcolor: string
  link: string
  caption: string
  createdAt: string
}

async function getStories(): Promise<Story[]> {
  const filePath = join(process.cwd(), "data", "stories.json")
  const fileContent = await readFile(filePath, "utf-8")
  return JSON.parse(fileContent)
}

async function getPosts(): Promise<Post[]> {
  const filePath = join(process.cwd(), "data", "posts.json")
  const fileContent = await readFile(filePath, "utf-8")
  return JSON.parse(fileContent)
}

export default async function StoriesClient() {
  const stories = await getStories()
  const posts = await getPosts()

  // Merge stories with their posts
  const storiesWithPosts = stories.map(story => {
    const post = posts.find(p => p.storyId === story.id)
    return {
      ...story,
      ...post
    }
  })

  return (
    <div className="flex gap-3 w-full max-w-7xl mx-auto overflow-x-auto px-4 pt-6 scrollbar-hide">
      {storiesWithPosts.map((story) => (
        <StoryItemClient key={story.id} story={story} />
      ))}
    </div>
  )
}

// ISR: Revalidate every 60 seconds
export const revalidate = 60
