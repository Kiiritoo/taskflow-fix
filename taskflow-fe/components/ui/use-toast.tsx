export function toast({ title, description, duration = 3000 }) {
  // This is a simplified toast implementation
  // In a real app, you would use a proper toast library
  const toastEvent = new CustomEvent("toast", {
    detail: {
      title,
      description,
      duration,
    },
  })

  window.dispatchEvent(toastEvent)
}
