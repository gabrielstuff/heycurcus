// File upload to R2 storage
export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }
  
  const file = formData[0]
  if (!file.data || !file.filename) {
    throw createError({ statusCode: 400, message: 'Invalid file' })
  }
  
  // Generate unique key
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 8)
  const ext = file.filename.split('.').pop() || 'pdf'
  const key = `uploads/${timestamp}-${randomId}.${ext}`
  
  // Get R2 binding
  const r2 = (event.context.cloudflare?.env as any)?.R2
  
  if (r2) {
    // Upload to R2
    await r2.put(key, file.data, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream'
      }
    })
    
    return {
      success: true,
      key,
      filename: file.filename,
      size: file.data.length
    }
  } else {
    // Fallback: use Nuxt's useStorage for local dev
    const storage = useStorage('r2')
    await storage.setItemRaw(key, file.data)
    
    return {
      success: true,
      key,
      filename: file.filename,
      size: file.data.length,
      local: true
    }
  }
})
