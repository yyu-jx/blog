const imageHost = 'https://gcore.jsdelivr.net/gh/yyu-jx/blog-images@main/images/'

export function imageUrl(filename) {
    return new URL(filename, imageHost).href
}
